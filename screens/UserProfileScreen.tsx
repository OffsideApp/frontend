// screens/UserProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Trophy, Flame, UserPlus, UserCheck, ArrowLeft } from 'lucide-react-native'; // 🚀 Added UserCheck
import { useRoute, useNavigation } from '@react-navigation/native';

import { Colors } from '../constants/theme';
import { CLUBS } from '../constants/clubs';
import FeedCard from '../components/FeedCard'; 
import { useAuthMutations, useProfileQuery } from '../services/auth/auth.queries'; 

const { width } = Dimensions.get('window');

export default function UserProfileScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const passedUsername = route.params?.username; 

  const { followMutation } = useAuthMutations();
  
  const { data: profileResponse, isLoading } = useProfileQuery(passedUsername);
  const displayUser = profileResponse?.data;

  const clubData = CLUBS.find(c => c.name === displayUser?.club);

  // 🚀 Local State for the Follow Button
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  // 🚀 Sync local state with the database when the profile loads
 //
  useEffect(() => {
    if (displayUser) {
      setIsFollowing(displayUser.isFollowing || false);
      setFollowerCount(displayUser._count?.followers || 0); // 👈 Set initial number
    }
  }, [displayUser]);

 const handleFollowToggle = () => {
    if (displayUser?.id) {
      // 🚀 THE TWITTER MAGIC: Do the math instantly!
      if (isFollowing) {
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1); // Instantly subtract 1
      } else {
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1); // Instantly add 1
      }
      // Send network request in the background
      followMutation.mutate(displayUser.id);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>@{displayUser?.username}</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View style={styles.bannerContainer}>
          {clubData?.logo ? (
            <>
              <Image source={{ uri: clubData.logo }} style={styles.bannerImage} contentFit="cover" />
              <View style={styles.bannerOverlay} /> 
            </>
          ) : (
            <View style={styles.bannerPlaceholder} />
          )}
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            {displayUser?.avatar ? (
              <Image source={{ uri: displayUser.avatar }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>
                  {displayUser?.username?.substring(0, 2).toUpperCase() || "?"}
                </Text>
              </View>
            )}
          </View>

          {/* 🚀 DYNAMIC FOLLOW BUTTON */}
          <TouchableOpacity 
            style={[styles.profileFollowBtn, isFollowing && styles.profileFollowingBtn]} 
            onPress={handleFollowToggle}
          >
            {isFollowing ? (
              <UserCheck size={16} color="#A1A1A1" />
            ) : (
              <UserPlus size={16} color="#000" />
            )}
            <Text style={[styles.profileFollowText, isFollowing && styles.profileFollowingText]}>
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bodyContent}>
          <View style={styles.infoContainer}>
            <Text style={styles.username}>@{displayUser?.username || "unknown"}</Text>
            <View style={styles.clubBadge}>
              {clubData?.logo && <Image source={{ uri: clubData.logo }} style={styles.clubLogo} />}
              <Text style={styles.clubText}>{displayUser?.club || "No Club"}</Text>
            </View>

            <Text style={styles.bioText}>
              {displayUser?.bio || "Just here for the vibes and to defend my club's honor."}
            </Text>
          </View>

          <View style={styles.networkRow}>
            <View style={styles.networkItem}>
              <Text style={styles.networkCount}>{followerCount}</Text>
              <Text style={styles.networkLabel}>Followers</Text>
            </View>
            <View style={styles.networkItem}>
              <Text style={styles.networkCount}>{displayUser?._count?.following || 0}</Text>
              <Text style={styles.networkLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
               <Text style={styles.statNumber}>{displayUser?.clout?.totalCooks || 0}</Text>
               <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
               <Text style={styles.statNumber}>{displayUser?.clout?.totalOffsides || 0}</Text>
               <Text style={styles.statLabel}>Dislikes</Text>
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
              username={displayUser?.username || "unknown"}
              club={displayUser?.club || "No Club"}
              avatar={displayUser?.avatar}
              content="If you think prime Hazard was better than Salah, you need to be investigated by the EFCC. The stats don't lie!"
              time="Pinned"
              initialCooks={1420}
              initialOffsides={4}
              commentsCount={89}
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
  iconBtn: { padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 20 },
  bannerContainer: { width: width, height: 220, backgroundColor: '#1A1A1A', position: 'relative' },
  bannerImage: { width: '100%', height: '100%', opacity: 0.8 }, 
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13, 13, 13, 0.2)' },
  bannerPlaceholder: { width: '100%', height: '100%', backgroundColor: '#1F1F1F' },
  avatarContainer: { alignItems: 'center', marginTop: -50, zIndex: 10 },
  avatarWrapper: { position: 'relative', borderRadius: 50, padding: 4, backgroundColor: '#0D0D0D' }, 
  avatar: { width: 92, height: 92, borderRadius: 46, borderWidth: 2, borderColor: Colors.primary },
  avatarPlaceholder: { width: 92, height: 92, borderRadius: 46, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#555' },
  avatarInitials: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  
  // 🚀 UPDATED FOLLOW BUTTON STYLES
  profileFollowBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 20, marginTop: 12 },
  profileFollowText: { color: '#000', fontWeight: 'bold', marginLeft: 6, fontSize: 16 },
  profileFollowingBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  profileFollowingText: { color: '#A1A1A1' },

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