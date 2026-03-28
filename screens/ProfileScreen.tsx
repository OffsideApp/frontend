// screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, LogOut, Trophy, Flame } from 'lucide-react-native';
import { useAuthStore } from '../store/useAuthStore';
import { Colors } from '../constants/theme';
import { CLUBS } from '../constants/clubs';
import FeedCard from '../components/FeedCard'; 

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(user?.avatar || null);

  const clubData = CLUBS.find(c => c.name === user?.club);

  const pickProfilePicture = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("We need permission to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.8,
    });

    if (!result.canceled) {
      setLocalAvatar(result.assets[0].uri);
      uploadProfilePicture(result.assets[0].uri);
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    setIsUploading(true);
    try {
      // Simulating network request for now
      setTimeout(() => setIsUploading(false), 1500); 
    } catch (error) {
      console.error("Failed to upload avatar", error);
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <LogOut size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* --- DYNAMIC CLUB BANNER --- */}
        <View style={styles.bannerContainer}>
          {clubData?.logo ? (
            <>
              <Image 
                source={{ uri: clubData.logo }} 
                style={styles.bannerImage} 
                contentFit="cover" 
              />
              {/* This overlay darkens the logo so it looks like a sleek watermark */}
              <View style={styles.bannerOverlay} /> 
            </>
          ) : (
            <View style={styles.bannerPlaceholder} />
          )}
        </View>

        {/* --- AVATAR SECTION (Overlapping the banner) --- */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickProfilePicture} activeOpacity={0.8} style={styles.avatarWrapper}>
            {localAvatar ? (
              <Image source={{ uri: localAvatar }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>
                  {user?.username?.substring(0, 2).toUpperCase() || "?"}
                </Text>
              </View>
            )}
            
            <View style={styles.cameraBadge}>
              {isUploading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Camera size={14} color="#000" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* --- PADDED BODY CONTENT --- */}
        <View style={styles.bodyContent}>
          {/* --- USER INFO & BIO --- */}
          <View style={styles.infoContainer}>
            <Text style={styles.username}>@{user?.username || "unknown"}</Text>
            <View style={styles.clubBadge}>
              {clubData?.logo && <Image source={{ uri: clubData.logo }} style={styles.clubLogo} />}
              <Text style={styles.clubText}>{user?.club || "No Club"}</Text>
            </View>

            <Text style={styles.bioText}>
              {user?.bio || "Just here for the vibes and to defend my club's honor."}
            </Text>
          </View>

          {/* --- NETWORK STATS --- */}
          <View style={styles.networkRow}>
            <View style={styles.networkItem}>
              <Text style={styles.networkCount}>1.2k</Text>
              <Text style={styles.networkLabel}>Followers</Text>
            </View>
            <View style={styles.networkItem}>
              <Text style={styles.networkCount}>340</Text>
              <Text style={styles.networkLabel}>Following</Text>
            </View>
          </View>

          {/* --- CLOUT STATS --- */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
               <Text style={styles.statNumber}>8.5k</Text>
               <Text style={styles.statLabel}>Cooks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
               <Text style={styles.statNumber}>12</Text>
               <Text style={styles.statLabel}>Offsides</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <Trophy size={16} color={Colors.primary} style={{ marginRight: 4 }} />
                 <Text style={styles.statNumber}>3</Text>
               </View>
               <Text style={[styles.statLabel, { color: Colors.primary }]}>TOTW</Text>
            </View>
          </View>

          {/* --- TOP BANGER SECTION --- */}
          <View style={styles.bangerSection}>
            <View style={styles.bangerHeader}>
              <Flame size={20} color={Colors.primary} fill="rgba(204, 255, 0, 0.2)" />
              <Text style={styles.bangerTitle}>Top Banger</Text>
            </View>
            
            <FeedCard 
              username={user?.username || "unknown"}
              club={user?.club || "No Club"}
              content="If you think prime Hazard was better than Salah, you need to be investigated by the EFCC. The stats don't lie!"
              time="Pinned"
              initialCooks={1420}
              initialOffsides={4}
              commentsCount={89}
              hasAudio={true}
              audioDuration="1:05"
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, paddingTop: 10, zIndex: 10, backgroundColor: '#0D0D0D' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  logoutBtn: { padding: 8, backgroundColor: 'rgba(255, 59, 48, 0.1)', borderRadius: 20 },
  
  // 🚀 BANTER STYLES
  bannerContainer: { width: width, height: 140, backgroundColor: '#1A1A1A', position: 'relative' },
  bannerImage: { width: '100%', height: '100%', opacity: 0.5 },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13, 13, 13, 0.5)' }, // Fades the logo into the dark background
  bannerPlaceholder: { width: '100%', height: '100%', backgroundColor: '#1F1F1F' },
  
  // 🚀 AVATAR STYLES (Notice the negative marginTop!)
  avatarContainer: { alignItems: 'center', marginTop: -50, zIndex: 10 },
  avatarWrapper: { position: 'relative', borderRadius: 50, padding: 4, backgroundColor: '#0D0D0D' }, // The padding creates a ring effect cutting into the banner
  avatar: { width: 92, height: 92, borderRadius: 46, borderWidth: 2, borderColor: Colors.primary },
  avatarPlaceholder: { width: 92, height: 92, borderRadius: 46, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#555' },
  avatarInitials: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  cameraBadge: { position: 'absolute', bottom: 4, right: 0, backgroundColor: Colors.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#0D0D0D' },
  
  // 🚀 BODY STYLES
  bodyContent: { paddingHorizontal: 20 },
  
  infoContainer: { alignItems: 'center', marginTop: 12 },
  username: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  clubBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F1F1F', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  clubLogo: { width: 16, height: 16, marginRight: 6 },
  clubText: { color: '#CCC', fontSize: 14, fontWeight: '600' },
  bioText: { color: '#A1A1A1', fontSize: 15, textAlign: 'center', marginTop: 16, paddingHorizontal: 20, lineHeight: 22 },

  networkRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 40 },
  networkItem: { alignItems: 'center' },
  networkCount: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  networkLabel: { color: '#777', fontSize: 13, marginTop: 2 },

  statsRow: { flexDirection: 'row', backgroundColor: '#1F1F1F', borderRadius: 16, marginTop: 30, paddingVertical: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#A1A1A1', fontSize: 11, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

  bangerSection: { marginTop: 40 },
  bangerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginLeft: 4 },
  bangerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
});