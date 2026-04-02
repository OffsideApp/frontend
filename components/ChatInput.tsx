// components/ChatInput.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Mic, Send } from 'lucide-react-native';
import { Colors } from '../constants/theme';

export default function ChatInput() {
  const [text, setText] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputBox}>
          <TextInput 
            style={styles.input}
            placeholder="Talk your shit..."
            placeholderTextColor="#666"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={200}
          />
          <TouchableOpacity style={styles.micBtn}>
            <Mic color="#FFF" size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.sendBtn, text.length > 0 && { backgroundColor: Colors.primary }]}
          disabled={text.length === 0}
        >
          <Send color={text.length > 0 ? "#000" : "#666"} size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: '#0D0D0D', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  inputBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, minHeight: 44, maxHeight: 100 },
  input: { flex: 1, color: '#FFF', fontSize: 15, paddingTop: 8, paddingBottom: 8 },
  micBtn: { padding: 4, marginLeft: 8 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', marginLeft: 12, marginBottom: 2 },
});