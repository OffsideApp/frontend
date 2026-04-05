// components/ChatInput.tsx
import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Text, Alert } from 'react-native';
import { Mic, Send, Trash2, Square } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Colors } from '../constants/theme';

type ChatInputProps = {
  onSend: (text: string, audioUri?: string, audioDuration?: number) => void;
};

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');
  
  // Audio State
  const [recordingState, setRecordingState] = useState<Audio.Recording | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null); // 🚀 The Safety Net for fast taps
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);

  // 🎙️ START RECORDING
  const startRecording = async () => {
    try {
      // 1. Strictly check permissions first!
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert("Permission Denied", "Please allow microphone access to send voice notes.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 2. Start the recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      // 3. Save it to both state AND the ref
      recordingRef.current = recording;
      setRecordingState(recording);
      
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // 🛑 STOP RECORDING
  const stopRecording = async () => {
    // 🚀 Check the ref instead of state to avoid the Quick-Tap bug!
    const activeRecording = recordingRef.current;
    if (!activeRecording) return; 

    try {
      await activeRecording.stopAndUnloadAsync();
      const uri = activeRecording.getURI();
      const status = await activeRecording.getStatusAsync();
      
      if (uri) {
        setAudioUri(uri);
      }
      
      // Convert milliseconds to seconds safely
      // RecordingStatus inherently has durationMillis, no need to check isLoaded!
      setDuration(Math.floor(status.durationMillis / 1000));
      // Clear both the ref and the state
      recordingRef.current = null;
      setRecordingState(null);
      
    } catch (err) {
      console.error('Failed to stop recording', err);
      // Failsafe cleanup
      recordingRef.current = null;
      setRecordingState(null);
    }
  };

  // 🚀 SEND HANDLER
  const handleSend = () => {
    if (text.trim().length === 0 && !audioUri) return;

    // Pass data up to MatchDayScreen
    onSend(text.trim(), audioUri || undefined, duration);

    // Clear the input after sending
    setText('');
    setAudioUri(null);
    setDuration(0);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputBox}>
          
          {/* Conditional UI: Text Input vs Audio Ready vs Recording */}
          {audioUri ? (
            // State 1: Audio Recorded & Ready to Send
            <View style={styles.audioReadyContainer}>
              <TouchableOpacity onPress={() => setAudioUri(null)} style={styles.trashBtn}>
                <Trash2 color="#FF3B30" size={18} />
              </TouchableOpacity>
              <Text style={styles.audioReadyText}>Audio Rant Ready ({duration}s)</Text>
            </View>
          ) : recordingState ? (
            // State 2: Actively Recording
            <View style={styles.audioReadyContainer}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording...</Text>
            </View>
          ) : (
            // State 3: Default Text Input
            <TextInput 
              style={styles.input}
              placeholder="Talk your shit..."
              placeholderTextColor="#666"
              value={text}
              onChangeText={setText}
              multiline
              maxLength={200}
            />
          )}

          {/* Mic / Stop Recording Button */}
          {!audioUri && text.length === 0 && (
            <TouchableOpacity 
              style={styles.micBtn}
              onPressIn={startRecording} 
              onPressOut={stopRecording} 
            >
              {recordingState ? (
                <Square color="#FF3B30" size={20} /> 
              ) : (
                <Mic color="#FFF" size={20} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Send Button */}
        <TouchableOpacity 
          style={[styles.sendBtn, (text.length > 0 || audioUri) && { backgroundColor: Colors.primary }]}
          disabled={text.length === 0 && !audioUri}
          onPress={handleSend}
        >
          <Send color={(text.length > 0 || audioUri) ? "#000" : "#666"} size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: '#0D0D0D', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  inputBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, minHeight: 44, maxHeight: 100 },
  input: { flex: 1, color: '#FFF', fontSize: 15, paddingTop: 8, paddingBottom: 8 },
  micBtn: { padding: 8, marginLeft: 4 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', marginLeft: 12, marginBottom: 2 },
  
  // Audio UI Styles
  audioReadyContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 28 },
  trashBtn: { padding: 4, marginRight: 8, backgroundColor: 'rgba(255, 59, 48, 0.1)', borderRadius: 12 },
  audioReadyText: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  recordingDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF3B30', marginRight: 8 },
  recordingText: { color: '#FF3B30', fontSize: 14, fontWeight: 'bold' },
});