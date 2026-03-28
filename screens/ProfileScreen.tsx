// screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, LogOut, Trophy, Flame } from 'lucide-react-native';
import { Colors } from '../constants/theme';
import { CLUBS } from '../constants/clubs';
import FeedCard from '../components/FeedCard'; 
import { useAuthMutations } from '../services/auth/auth.queries'; 
import { useCurrentUser } from '../hooks/useCurrentUser'; // 🚀 BOOM! The global hook.
import { useAuthStore } from '../store/useAuthStore';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  // 1. We just need the logout action from Zustand now
  const { logout } = useAuthStore();
  // 2. We need the mutation to actually send the picture to the backend
  const { uploadAvatarMutation } = useAuthMutations();
  // 3. 🚀 THE MAGIC HOOK: This gives us the perfect, auto-updating user object
  const { user, isLoading } = useCurrentUser(); 
  // Local state just for instant image preview before the network request finishes
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  // Simple lookups using the guaranteed data from our hook
  const displayAvatar = localAvatar || user?.avatar;
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
      const uri = result.assets[0].uri;
      setLocalAvatar(uri); // Instant visual update

      const formData = new FormData();
      formData.append('avatar', {
        uri: uri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      } as any);

      // The hook handles the Zustand update automatically on success now, 
      // so we just fire the mutation and let React Query invalidate the cache!
      uploadAvatarMutation.mutate(formData);
    }
  };

  if (isLoading && !user?.username) {
    // Only show the massive loading spinner if we literally have NO local data
    // (This prevents the annoying flash when they already have cached data)
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <LogOut size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View style={styles.bannerContainer}>
          {clubData?.logo ? (
            <>
              <Image 
                source={{ uri: clubData.logo }} 
                style={styles.bannerImage} 
                contentFit="cover" 
              />
              <View style={styles.bannerOverlay} /> 
            </>
          ) : (
            <View style={styles.bannerPlaceholder} />
          )}
        </View>

        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickProfilePicture} activeOpacity={0.8} style={styles.avatarWrapper}>
            {displayAvatar ? (
              <Image source={{ uri: displayAvatar }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>
                  {user?.username?.substring(0, 2).toUpperCase() || "?"}
                </Text>
              </View>
            )}
            
            <View style={styles.cameraBadge}>
              {uploadAvatarMutation.isPending ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Camera size={14} color="#000" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bodyContent}>
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

          <View style={styles.networkRow}>
            <View style={styles.networkItem}>
              {/* Because of our hook, _count is now directly on the user object! */}
              <Text style={styles.networkCount}>{user?._count?.followers || 0}</Text>
              <Text style={styles.networkLabel}>Followers</Text>
            </View>
            <View style={styles.networkItem}>
              <Text style={styles.networkCount}>{user?._count?.following || 0}</Text>
              <Text style={styles.networkLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
               {/* Because of our hook, clout is now directly on the user object! */}
               <Text style={styles.statNumber}>{user?.clout?.totalCooks || 0}</Text>
               <Text style={styles.statLabel}>Cooks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
               <Text style={styles.statNumber}>{user?.clout?.totalOffsides || 0}</Text>
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

          <View style={styles.bangerSection}>
            <View style={styles.bangerHeader}>
              <Flame size={20} color={Colors.primary} fill="rgba(204, 255, 0, 0.2)" />
              <Text style={styles.bangerTitle}>Top Banger</Text>
            </View>
            
            <FeedCard 
              postId="pinned-mock-post"
              username={user?.username || "unknown"}
              club={user?.club || "No Club"}
              avatar={user?.avatar}
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
  // ... all your exact same styles ...
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, paddingTop: 10, zIndex: 10, backgroundColor: '#0D0D0D' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  logoutBtn: { padding: 8, backgroundColor: 'rgba(255, 59, 48, 0.1)', borderRadius: 20 },
  
  bannerContainer: { width: width, height: 140, backgroundColor: '#1A1A1A', position: 'relative' },
  bannerImage: { width: '100%', height: '100%', opacity: 0.5 },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13, 13, 13, 0.5)' }, 
  bannerPlaceholder: { width: '100%', height: '100%', backgroundColor: '#1F1F1F' },
  
  avatarContainer: { alignItems: 'center', marginTop: -50, zIndex: 10 },
  avatarWrapper: { position: 'relative', borderRadius: 50, padding: 4, backgroundColor: '#0D0D0D' }, 
  avatar: { width: 92, height: 92, borderRadius: 46, borderWidth: 2, borderColor: Colors.primary },
  avatarPlaceholder: { width: 92, height: 92, borderRadius: 46, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#555' },
  avatarInitials: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  cameraBadge: { position: 'absolute', bottom: 4, right: 0, backgroundColor: Colors.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#0D0D0D' },
  
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