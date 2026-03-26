// screens/CreatePostScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { X, Mic, Square, Play, Trash2 } from 'lucide-react-native'; 
import { Audio } from 'expo-av'; // 👈 The magic audio library
import { Colors } from '../constants/theme'; 
import { useFeedQueries } from '../services/feed/feed.queries';

// Helper to format milliseconds into mm:ss
const formatTime = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
};

export default function CreatePostScreen() {
  const navigation = useNavigation<any>();
  const [content, setContent] = useState('');
  
  // --- AUDIO STATES ---
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // For later!

  const { createPostMutation } = useFeedQueries();

  // Cleanup memory when closing the screen
  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  // --- AUDIO FUNCTIONS ---
  async function startRecording() {
    try {
      Keyboard.dismiss();
      // 1. Request microphone permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('We need microphone permissions to record your rant!');
        return;
      }

      // 2. Prepare the device for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 3. Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      
      // 4. Track duration while recording
      recording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording) {
          setRecordingDuration(status.durationMillis);
        }
      });

    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); // 👈 This is the local file on the phone
      setAudioUri(uri);
      setRecording(null);
      
      // Reset audio mode for playback
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  async function playAudio() {
    if (!audioUri) return;
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
      
      // Reset when finished playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      console.error('Failed to play audio', err);
    }
  }

  function deleteAudio() {
    setAudioUri(null);
    setRecordingDuration(0);
    if (sound) sound.unloadAsync();
  }

  // --- SUBMIT FUNCTION ---
  // --- SUBMIT FUNCTION ---
  const handlePost = async () => {
    if (!content.trim() && !audioUri) return;
    Keyboard.dismiss();

    // 1. Create a new FormData instance
    const formData = new FormData();
    
    // 2. Append the text content (if it exists)
    if (content.trim()) {
      formData.append('content', content);
    }

    // 3. Append the Audio File (if it exists)
    if (audioUri) {
      // React Native specific trick: cast this object as `any` 
      // because standard TS thinks FormData can only be strings/blobs
      formData.append('audioFile', {
        uri: audioUri,
        name: 'rant.m4a',
        type: 'audio/m4a',
      } as any);

      // Append the duration we tracked
      formData.append('audioDuration', formatTime(recordingDuration));
    }

    // 4. Send it to the backend!
    createPostMutation.mutate(formData, {
      onSuccess: () => navigation.goBack(),
      onError: (error: any) => {
        console.error("Failed to post:", error);
        alert("Failed to upload post. Check your connection.");
      }
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <X size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.postButton, (!content.trim() && !audioUri) && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={(!content.trim() && !audioUri) || createPostMutation.isPending || isUploading}
        >
          {createPostMutation.isPending || isUploading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Drop your tactical masterclass (or rant)..."
          placeholderTextColor="#555"
          multiline
          autoFocus={!recording && !audioUri}
          maxLength={280} 
          value={content}
          onChangeText={setContent}
        />
        
        {/* --- RECORDING UI INJECTION --- */}
        {recording && (
          <View style={styles.recordingActiveContainer}>
            <View style={styles.redDotPulse} />
            <Text style={styles.recordingTimeText}>{formatTime(recordingDuration)}</Text>
          </View>
        )}

        {/* --- AUDIO PLAYER UI INJECTION --- */}
        {audioUri && !recording && (
          <View style={styles.audioPlayerContainer}>
            <TouchableOpacity onPress={playAudio} style={styles.playButton}>
               <Play size={20} color="#000" fill="#000" />
            </TouchableOpacity>
            <Text style={styles.audioDurationText}>Audio Rant attached ({formatTime(recordingDuration)})</Text>
            <TouchableOpacity onPress={deleteAudio} style={styles.deleteButton}>
               <Trash2 size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.toolbar}>
        {/* Toggle between Start and Stop Recording */}
        {recording ? (
          <TouchableOpacity style={[styles.toolbarButton, { backgroundColor: '#FF3B30' }]} onPress={stopRecording}>
            <Square size={20} color="#FFF" fill="#FFF" />
            <Text style={[styles.toolbarText, { color: '#FFF' }]}>Stop Recording</Text>
          </TouchableOpacity>
        ) : !audioUri ? (
          <TouchableOpacity style={styles.toolbarButton} onPress={startRecording}>
            <Mic size={22} color={Colors.primary} />
            <Text style={styles.toolbarText}>Record Voice Note</Text>
          </TouchableOpacity>
        ) : (
          <View /> // Empty view to push character count to the right if audio exists
        )}
        <Text style={styles.charCount}>{content.length}/280</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // ... Keep all your previous styles and add these new ones: ...
  container: { flex: 1, backgroundColor: '#151515' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 20 : 40, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  iconButton: { padding: 8 },
  postButton: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  postButtonDisabled: { opacity: 0.5 },
  postButtonText: { color: '#000000', fontWeight: 'bold', fontSize: 16 },
  inputContainer: { flex: 1, padding: 20 },
  textInput: { color: '#FFFFFF', fontSize: 18, lineHeight: 28, textAlignVertical: 'top', minHeight: 100 },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  toolbarButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(204, 255, 0, 0.1)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  toolbarText: { color: Colors.primary, marginLeft: 8, fontWeight: '600' },
  charCount: { color: '#555', fontSize: 14 },
  
  // NEW STYLES FOR AUDIO UI
  recordingActiveContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 59, 48, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginTop: 20 },
  redDotPulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF3B30', marginRight: 8 },
  recordingTimeText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 16 },
  audioPlayerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, marginTop: 20 },
  playButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  audioDurationText: { color: '#FFF', flex: 1, marginLeft: 12, fontWeight: '500' },
  deleteButton: { padding: 8 },
});