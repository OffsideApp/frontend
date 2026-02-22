import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Dimensions, 
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Search, Check, Zap, RotateCw } from "lucide-react-native";
import { Colors } from "@/constants/theme"; 
import { useRouter } from "expo-router";
import StickyFooter from "@/components/StickyFooter";
import { Image } from 'expo-image';
import { CLUBS
  
 } from "@/constants/clubs";
const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_COUNT = 3;
const ITEM_SIZE = (SCREEN_WIDTH - 48) / COLUMN_COUNT; // 48 = padding (20*2) + gap (8)

export default function SelectClubScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedClub, setSelectedClub] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedClub) {
      router.replace("/(home)/feed");
    }
  };

  const renderClub = ({ item }: { item: typeof CLUBS[0] }) => {
    const isSelected = selectedClub === item.id;

    return (
      <TouchableOpacity 
        style={styles.clubItemContainer} 
        onPress={() => setSelectedClub(item.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.clubCard, isSelected && styles.clubCardSelected]}>
          {isSelected && (
            <View style={styles.checkBadge}>
              <Check size={10} color="black" strokeWidth={4} />
            </View>
          )}
          
          {/* 👇 THE NEW ACTUAL LOGO 👇 */}
          <Image 
            source={{ uri: item.logo }} 
            style={styles.clubLogo} 
            contentFit="contain"
            transition={200} // Smooth fade-in
          />
        </View>
        
        <Text style={[styles.clubName, isSelected && styles.clubNameSelected]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}> 
           <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Select Your Club</Text>
        
        {/* The "Refresh" Button from your screenshot */}
        <TouchableOpacity style={styles.refreshButton}>
            <RotateCw color="#555" size={20} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
        
        {/* Main Content List */}
        <FlatList
          data={CLUBS}
          keyExtractor={(item) => item.id}
          renderItem={renderClub}
          numColumns={COLUMN_COUNT}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          
          // The Search & Title are part of the list header so they scroll away
          ListHeaderComponent={
            <>
              <View style={styles.textSection}>
                <Text style={styles.bigTitle}>Who do you support?</Text>
                <Text style={styles.subtitle}>Choose your team to start the banter.</Text>
              </View>

              <View style={styles.searchContainer}>
                <Search color="#555" size={20} style={{ marginRight: 10 }} />
                <TextInput 
                  style={styles.searchInput}
                  placeholder="Find your team..."
                  placeholderTextColor="#555"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </>
          }
        />

        {/* Sticky Footer Button */}
        {/* <View style={styles.footerContainer}>
            <TouchableOpacity 
                style={[styles.actionButton, !selectedClub && styles.actionButtonDisabled]}
                onPress={handleContinue}
                disabled={!selectedClub}
            >
                <Text style={styles.actionButtonText}>START BANTERING</Text>
                <Zap size={20} color="black" fill="black" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
        </View> */}
        <StickyFooter title="Start bantering" onPress={() => router.replace("/(home)/feed") } disabled={false}  />

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0D0D0D" 
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  iconButton: {
    padding: 5,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  // List Layout
  listContent: { 
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for the floating button
  },
  
  // Text Section
  textSection: { 
    alignItems: 'center', 
    marginTop: 20,
    marginBottom: 30 
  },
  bigTitle: { 
    color: 'white', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  subtitle: { 
    color: '#777', 
    fontSize: 14, 
    textAlign: 'center' 
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12, // Slightly more squared like screenshot
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 30,
  },
  searchInput: { flex: 1, color: 'white', fontSize: 16 },

  // Grid Items
  columnWrapper: { 
    justifyContent: 'space-between', 
    marginBottom: 15 
  },
  clubItemContainer: { 
    width: ITEM_SIZE, 
    alignItems: 'center' 
  },
  clubCard: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 16,
    backgroundColor: '#1F1F1F', // Dark card
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  clubCardSelected: { 
    borderColor: Colors.primary, // Neon Green Border
    backgroundColor: '#1F1F1F', // Keep dark bg, just border highlights
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  placeholderLogo: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  initials: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  clubLogo: {
    width: 48,
    height: 48,
  },
  clubName: { 
    color: '#555', 
    fontSize: 12, 
    fontWeight: '500' 
  },
  clubNameSelected: { 
    color: Colors.primary, 
    fontWeight: 'bold' 
  },

  // Sticky Footer Button
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40, // Push up from safe area
    paddingTop: 20,
    backgroundColor: '#0D0D0D', // Hide list content behind it
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  actionButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Premium Glow
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  actionButtonDisabled: { 
    backgroundColor: '#333', 
    shadowOpacity: 0 
  },
  actionButtonText: { 
    color: 'black', 
    fontSize: 16, 
    fontWeight: '900', 
    letterSpacing: 0.5 
  },
});