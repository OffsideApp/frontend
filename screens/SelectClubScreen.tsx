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
import { ArrowLeft, Search, Check, RotateCw } from "lucide-react-native";
import { Colors } from "@/constants/theme"; 
import { useRouter } from "expo-router";
import StickyFooter from "@/components/StickyFooter";
import { Image } from 'expo-image';
import { CLUBS } from "@/constants/clubs";

// 👇 1. Import your hook
import { useAuthMutations } from "@/services/auth/auth.queries";
import { useAuthStore } from "@/store/useAuthStore";

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_COUNT = 3;
const ITEM_SIZE = (SCREEN_WIDTH - 48) / COLUMN_COUNT;

export default function SelectClubScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedClub, setSelectedClub] = useState<string | null>(null);

  // 👇 2. Initialize the mutation
  const { selectClubMutation } = useAuthMutations();
  const { logout } = useAuthStore();

  const handleContinue = () => {
    if (selectedClub) {
      // 👇 3. Find the Club Name (backend expects "Arsenal", not "1")
      const clubObj = CLUBS.find(c => c.id === selectedClub);
      if (clubObj) {
        selectClubMutation.mutate({clubName: clubObj.name });
      }
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
          
          <Image 
            source={{ uri: item.logo }} 
            style={styles.clubLogo} 
            contentFit="contain"
            transition={200}
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
        
     <TouchableOpacity 
           style={styles.refreshButton}
           onPress={() => {
              logout(); // Wipes the bad token from Zustand
              router.replace('/(auth)/login'); // Kicks you back to login
           }}
        >
            <Text style={{color: 'red', fontSize: 10, fontWeight: 'bold'}}>NUKE</Text>
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

        {/* 👇 4. Connect the StickyFooter to the mutation state */}
        <StickyFooter 
          title={selectClubMutation.isPending ? "SAVING..." : "START BANTERING"} 
          onPress={handleContinue} 
          disabled={!selectedClub || selectClubMutation.isPending}  
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ... Keep your exact same styles down here
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  iconButton: { padding: 5 },
  refreshButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1F1F1F', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  listContent: { paddingHorizontal: 20, paddingBottom: 120 },
  textSection: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  bigTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#777', fontSize: 14, textAlign: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F1F1F', paddingHorizontal: 16, height: 50, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", marginBottom: 30 },
  searchInput: { flex: 1, color: 'white', fontSize: 16 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 15 },
  clubItemContainer: { width: ITEM_SIZE, alignItems: 'center' },
  clubCard: { width: ITEM_SIZE, height: ITEM_SIZE, borderRadius: 16, backgroundColor: '#1F1F1F', alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 2, borderColor: 'transparent' },
  clubCardSelected: { borderColor: Colors.primary, backgroundColor: '#1F1F1F' },
  checkBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: Colors.primary, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  clubLogo: { width: 48, height: 48 },
  clubName: { color: '#555', fontSize: 12, fontWeight: '500' },
  clubNameSelected: { color: Colors.primary, fontWeight: 'bold' },
});