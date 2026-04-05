import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Mic, Send, Trash2, Square } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Colors } from '../constants/theme';

type ChatInputProps = {
  onSend: (text: string, audioUri?: string, audioDuration?: number) => void;
};

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const isSettingUp = useRef(false); // 🔒 Lock to prevent overlapping startRecording calls
  const shouldStop = useRef(false);  // 🚩 Flag: did the user release before setup finished?

  const startRecording = async () => {
    // 🔒 If already setting up or already recording, bail out completely
    if (isSettingUp.current || recordingRef.current) return;

    isSettingUp.current = true;
    shouldStop.current = false;

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        isSettingUp.current = false;
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      // 🚩 User already lifted finger before we finished setup — stop immediately
      if (shouldStop.current) {
        await recording.stopAndUnloadAsync().catch(() => {});
        isSettingUp.current = false;
        return;
      }

      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      recordingRef.current = null;
      setIsRecording(false);
    } finally {
      isSettingUp.current = false;
    }
  };

  const stopRecording = async () => {
    // 🚩 If still setting up, just flag that we want to stop — startRecording will handle it
    if (isSettingUp.current) {
      shouldStop.current = true;
      return;
    }

    const activeRecording = recordingRef.current;
    if (!activeRecording) return;

    // Clear the ref immediately so nothing else can touch this instance
    recordingRef.current = null;
    setIsRecording(false);

    try {
      const status = await activeRecording.getStatusAsync();
      await activeRecording.stopAndUnloadAsync();

      const uri = activeRecording.getURI();
      const recordedDuration = Math.floor((status.durationMillis ?? 0) / 1000);

      // Ignore taps shorter than 1 second — accidental presses
      if (uri && recordedDuration >= 1) {
        setAudioUri(uri);
        setDuration(recordedDuration);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      // Salvage whatever URI we can
      const uri = activeRecording.getURI();
      if (uri) {
        setAudioUri(uri);
        setDuration(1);
      }
    }
  };

  const discardAudio = () => {
    setAudioUri(null);
    setDuration(0);
  };

  const handleSend = () => {
    if (!text.trim() && !audioUri) return;
    onSend(text.trim(), audioUri || undefined, duration);
    setText('');
    setAudioUri(null);
    setDuration(0);
  };

  const canSend = text.length > 0 || !!audioUri;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputBox}>

          {/* State 1: Audio is recorded and ready to send */}
          {audioUri && !isRecording && (
            <View style={styles.audioReadyContainer}>
              <TouchableOpacity onPress={discardAudio} style={styles.trashBtn}>
                <Trash2 color="#FF3B30" size={18} />
              </TouchableOpacity>
              <Text style={styles.audioReadyText}>Audio Rant Ready ({duration}s)</Text>
            </View>
          )}

          {/* State 2: Currently recording */}
          {isRecording && (
            <View style={styles.audioReadyContainer}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording...</Text>
            </View>
          )}

          {/* State 3: Normal text input */}
          {!audioUri && !isRecording && (
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

          {/* Mic button — only show when no audio is ready and not typing */}
          {!audioUri && text.length === 0 && (
            <TouchableOpacity
              style={styles.micBtn}
              onPressIn={startRecording}
              onPressOut={stopRecording}
              activeOpacity={1}
            >
              {isRecording
                ? <Square color="#FF3B30" size={20} />
                : <Mic color="#FFF" size={20} />
              }
            </TouchableOpacity>
          )}
        </View>

        {/* Send button */}
        <TouchableOpacity
          style={[styles.sendBtn, canSend && { backgroundColor: Colors.primary }]}
          disabled={!canSend}
          onPress={handleSend}
        >
          <Send color={canSend ? '#000' : '#666'} size={20} />
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
  audioReadyContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 28 },
  trashBtn: { padding: 4, marginRight: 8, backgroundColor: 'rgba(255, 59, 48, 0.1)', borderRadius: 12 },
  audioReadyText: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  recordingDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF3B30', marginRight: 8 },
  recordingText: { color: '#FF3B30', fontSize: 14, fontWeight: 'bold' },
});