// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   StyleSheet, 
//   KeyboardAvoidingView, 
//   Platform,
//   ActivityIndicator,
//   Keyboard
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { X, Mic } from 'lucide-react-native'; 
// import { Colors } from '@/constants/theme';
// import { useFeedQueries } from '@/services/feed/feed.queries';

// export default function CreatePostScreen() {
//   const router = useRouter();
//   const [content, setContent] = useState('');
  
//   // Bring in our mutation from the queries file
//   const { createPostMutation } = useFeedQueries();

//   const handlePost = () => {
//     if (!content.trim()) return;
    
//     Keyboard.dismiss();

//     createPostMutation.mutate(
//       { content }, 
//       {
//         onSuccess: () => {
//           router.back(); // Close modal and go back to feed on success
//         },
//         onError: (error: any) => {
//           console.error("Failed to post:", error);
//         }
//       }
//     );
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
//           <X size={28} color="#FFFFFF" />
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[
//             styles.postButton, 
//             (!content.trim() || createPostMutation.isPending) && styles.postButtonDisabled
//           ]}
//           onPress={handlePost}
//           disabled={!content.trim() || createPostMutation.isPending}
//         >
//           {createPostMutation.isPending ? (
//             <ActivityIndicator size="small" color="#000" />
//           ) : (
//             <Text style={styles.postButtonText}>Post</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* Text Area */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.textInput}
//           placeholder="Drop your tactical masterclass (or rant)..."
//           placeholderTextColor="#555"
//           multiline
//           autoFocus
//           maxLength={280} 
//           value={content}
//           onChangeText={setContent}
//         />
//       </View>

//       {/* Footer Toolbar (For Audio later) */}
//       <View style={styles.toolbar}>
//         <TouchableOpacity style={styles.toolbarButton}>
//           <Mic size={22} color={Colors.primary} />
//           <Text style={styles.toolbarText}>Record Voice Note</Text>
//         </TouchableOpacity>
        
//         <Text style={styles.charCount}>
//           {content.length}/280
//         </Text>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#151515' },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: Platform.OS === 'ios' ? 20 : 40,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.05)',
//   },
//   iconButton: { padding: 8 },
//   postButton: {
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   postButtonDisabled: { opacity: 0.5 },
//   postButtonText: { color: '#000000', fontWeight: 'bold', fontSize: 16 },
//   inputContainer: { flex: 1, padding: 20 },
//   textInput: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     lineHeight: 28,
//     textAlignVertical: 'top', 
//   },
//   toolbar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255,255,255,0.05)',
//   },
//   toolbarButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(204, 255, 0, 0.1)', 
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   toolbarText: { color: Colors.primary, marginLeft: 8, fontWeight: '600' },
//   charCount: { color: '#555', fontSize: 14 },
// });


// screens/CreatePostScreen.tsx
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard
} from 'react-native';
// 👇 Swapped expo-router for React Navigation
import { useNavigation } from '@react-navigation/native';
import { X, Mic } from 'lucide-react-native'; 
import { Colors } from '../constants/theme'; // Check path (../)
import { useFeedQueries } from '../services/feed/feed.queries'; // Check path (../)

export default function CreatePostScreen() {
  // 👇 Use React Navigation
  const navigation = useNavigation<any>();
  const [content, setContent] = useState('');
  
  const { createPostMutation } = useFeedQueries();

  const handlePost = () => {
    if (!content.trim()) return;
    Keyboard.dismiss();

    createPostMutation.mutate(
      { content }, 
      {
        onSuccess: () => {
          // 👇 Go back to feed on success
          navigation.goBack(); 
        },
        onError: (error: any) => {
          console.error("Failed to post:", error);
        }
      }
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        {/* 👇 Updated to navigation.goBack() */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <X size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.postButton, 
            (!content.trim() || createPostMutation.isPending) && styles.postButtonDisabled
          ]}
          onPress={handlePost}
          disabled={!content.trim() || createPostMutation.isPending}
        >
          {createPostMutation.isPending ? (
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
          autoFocus
          maxLength={280} 
          value={content}
          onChangeText={setContent}
        />
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolbarButton}>
          <Mic size={22} color={Colors.primary} />
          <Text style={styles.toolbarText}>Record Voice Note</Text>
        </TouchableOpacity>
        <Text style={styles.charCount}>{content.length}/280</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#151515' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  iconButton: { padding: 8 },
  postButton: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  postButtonDisabled: { opacity: 0.5 },
  postButtonText: { color: '#000000', fontWeight: 'bold', fontSize: 16 },
  inputContainer: { flex: 1, padding: 20 },
  textInput: { color: '#FFFFFF', fontSize: 18, lineHeight: 28, textAlignVertical: 'top' },
  toolbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)',
  },
  toolbarButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(204, 255, 0, 0.1)', 
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
  },
  toolbarText: { color: Colors.primary, marginLeft: 8, fontWeight: '600' },
  charCount: { color: '#555', fontSize: 14 },
});