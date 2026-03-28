import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard, Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { X, Mic, Square, Play, Trash2, Image as ImageIcon } from 'lucide-react-native'; 
import { Audio } from 'expo-av'; 
import * as ImagePicker from 'expo-image-picker'; // 👈 NEW: Image Picker
import { Colors } from '../constants/theme'; 
import { useFeedQueries } from '../services/feed/feed.queries';

const formatTime = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
};

export default function CreateCommentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); // 👈 Add this
  const { postId } = route.params;
  const [content, setContent] = useState('');
  
  // --- MEDIA STATES ---
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null); // 👈 NEW: Image State
  
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { createCommentMutation } = useFeedQueries();

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  // --- IMAGE LOGIC ---
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("We need permission to access your camera roll to post memes!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8, // Compress slightly for faster uploads
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // --- AUDIO LOGIC ---
  // ... (Keep your existing startRecording, stopRecording, playAudio, and deleteAudio functions exactly the same) ...
  async function startRecording() {
    try {
      Keyboard.dismiss();
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return alert('Need mic permissions!');
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      recording.setOnRecordingStatusUpdate((status) => { if (status.isRecording) setRecordingDuration(status.durationMillis); });
    } catch (err) { console.error(err); }
  }

  async function stopRecording() {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    setAudioUri(recording.getURI());
    setRecording(null);
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
  }

  async function playAudio() {
    if (!audioUri) return;
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(sound);
    setIsPlaying(true);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => { if (status.isLoaded && status.didJustFinish) setIsPlaying(false); });
  }

  function deleteAudio() {
    setAudioUri(null);
    setRecordingDuration(0);
    if (sound) sound.unloadAsync();
  }

  // --- SUBMIT FUNCTION ---
  const handlePost = async () => {
    if (!content.trim() && !audioUri && !imageUri) return;
    Keyboard.dismiss();

    const formData = new FormData();
    formData.append('postId', postId);
    
    if (content.trim()) formData.append('content', content);

    if (audioUri) {
      const filename = audioUri.split('/').pop() || 'rant.m4a';
      const safeUri = Platform.OS === 'ios' ? audioUri.replace('file://', '') : audioUri;
      formData.append('audioFile', { uri: safeUri, name: filename, type: 'audio/m4a' } as any);
      formData.append('audioDuration', formatTime(recordingDuration));
    }

    //  NEW: Append the image file!
    if (imageUri) {
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const safeUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;1
      formData.append('imageFile', { uri: safeUri, name: filename, type: 'image/jpeg' } as any);
    }

    createCommentMutation.mutate(formData, {
      onSuccess: () => navigation.goBack(),
      onError: (error: any) => console.error("Failed to post:", error)
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <X size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.postButton, (!content.trim() && !audioUri && !imageUri) && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={(!content.trim() && !audioUri && !imageUri) || createCommentMutation.isPending}
        >
          {createCommentMutation.isPending ? <ActivityIndicator size="small" color="#000" /> : <Text style={styles.postButtonText}>Post</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Drop your tactical masterclass, rant, or meme..."
          placeholderTextColor="#555"
          multiline
          autoFocus={!recording && !audioUri && !imageUri}
          maxLength={280} 
          value={content}
          onChangeText={setContent}
        />
        
        {/* IMAGE PREVIEW */}
        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity onPress={() => setImageUri(null)} style={styles.removeImageButton}>
              <X size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* RECORDING UI */}
        {recording && (
          <View style={styles.recordingActiveContainer}>
            <View style={styles.redDotPulse} />
            <Text style={styles.recordingTimeText}>{formatTime(recordingDuration)}</Text>
          </View>
        )}

        {/* AUDIO PLAYER UI */}
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
        <View style={styles.toolbarLeft}>
          {/* IMAGE BUTTON */}
          <TouchableOpacity style={styles.toolbarIconButton} onPress={pickImage} disabled={!!recording}>
            <ImageIcon size={24} color={Colors.primary} />
          </TouchableOpacity>

          {/* AUDIO BUTTON */}
          {recording ? (
            <TouchableOpacity style={[styles.toolbarButton, { backgroundColor: '#FF3B30' }]} onPress={stopRecording}>
              <Square size={20} color="#FFF" fill="#FFF" />
              <Text style={[styles.toolbarText, { color: '#FFF' }]}>Stop</Text>
            </TouchableOpacity>
          ) : !audioUri ? (
            <TouchableOpacity style={styles.toolbarIconButton} onPress={startRecording}>
              <Mic size={24} color={Colors.primary} />
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={styles.charCount}>{content.length}/280</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // ... (Keep existing styles, add these new ones) ...
  container: { flex: 1, backgroundColor: '#151515' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 20 : 40, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  iconButton: { padding: 8 },
  postButton: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  postButtonDisabled: { opacity: 0.5 },
  postButtonText: { color: '#000000', fontWeight: 'bold', fontSize: 16 },
  inputContainer: { flex: 1, padding: 20 },
  textInput: { color: '#FFFFFF', fontSize: 18, lineHeight: 28, textAlignVertical: 'top', minHeight: 100 },
  
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  toolbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  toolbarIconButton: { padding: 8, backgroundColor: 'rgba(204, 255, 0, 0.1)', borderRadius: 20 },
  toolbarButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  toolbarText: { marginLeft: 8, fontWeight: '600' },
  charCount: { color: '#555', fontSize: 14 },
  
  recordingActiveContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 59, 48, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginTop: 20 },
  redDotPulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF3B30', marginRight: 8 },
  recordingTimeText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 16 },
  audioPlayerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, marginTop: 20 },
  playButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  audioDurationText: { color: '#FFF', flex: 1, marginLeft: 12, fontWeight: '500' },
  deleteButton: { padding: 8 },

  // NEW IMAGE STYLES
  imagePreviewContainer: { marginTop: 16, position: 'relative', alignSelf: 'flex-start' },
  imagePreview: { width: 200, height: 250, borderRadius: 12 },
  removeImageButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', padding: 6, borderRadius: 15 },
});