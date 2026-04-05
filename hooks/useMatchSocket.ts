import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { io, Socket } from 'socket.io-client';

export const useMatchSocket = (initialMatch: any, user: any) => {
  const [currentMatch, setCurrentMatch] = useState<any>(initialMatch);
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!initialMatch?.id) return;

    // 🚀 REMINDER: If on Android Emulator, this MUST be http://10.0.2.2:3000
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

    const wsBaseUrl = apiUrl.split('/api')[0];

    socketRef.current = io(wsBaseUrl, { transports: ['websocket'] });

    // 🚀 NEW DEBUG LOGS: Watch your terminal when you enter the screen!
    socketRef.current.on('connect', () => console.log('🟢 WS CONNECTED TO SERVER!'));
    socketRef.current.on('connect_error', (err) => console.error('🔴 WS ERROR:', err.message));

    socketRef.current.emit('joinMatch', { matchId: initialMatch.id });

    socketRef.current.on('newMessage', (message) => {
      console.log("📨 Message received from server!");
      setMessages((prev) => [message, ...prev]); 
    });

    socketRef.current.on('scoreUpdate', (updatedMatchData) => {
      setCurrentMatch(updatedMatchData);
    });

    return () => {
      socketRef.current?.emit('leaveMatch', { matchId: initialMatch.id });
      socketRef.current?.disconnect();
    };
  }, [initialMatch?.id]);

  // 🚀 UPGRADED: Now Handles Cloudinary Uploads!
  const sendMessage = async (text: string, audioUri?: string, audioDuration?: number) => {
    if (!socketRef.current) return;
    
    let finalAudioUrl = audioUri;

    // If there is an audio file, upload it FIRST
    if (audioUri) {
      try {
        const formData = new FormData();
        
        // React Native needs this specific format to upload files
        formData.append('file', {
          uri: Platform.OS === 'ios' ? audioUri.replace('file://', '') : audioUri,
          name: 'rant.m4a', 
          type: 'audio/m4a',
        } as any);

        const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
        
        console.log("Uploading Audio to server...");
        const response = await fetch(`${apiUrl}/upload/audio`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        
        if (data.url) {
          finalAudioUrl = data.url; // 🚀 Swap the local URI for the Cloudinary URL!
          console.log("Audio Uploaded Successfully:", finalAudioUrl);
        } else {
          throw new Error("No URL returned from server");
        }
      } catch (error) {
        console.error('Failed to upload audio rant:', error);
        return; // Stop the message from sending if the upload fails!
      }
    }
    
    const messagePayload = {
      matchId: currentMatch.id,
      userId: user?.userId,
      username: user?.username || "Unknown Fan",
      club: user?.club || "Neutral",
      avatar: user?.avatar,
      message: text || undefined,
      hasAudio: !!finalAudioUrl,
      audioUrl: finalAudioUrl, 
      audioDuration: audioDuration ? `${audioDuration}s` : undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socketRef.current.emit('sendMessage', messagePayload);
  };

  return {
    currentMatch,
    messages,
    sendMessage,
  };
};