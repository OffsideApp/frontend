// screens/SelectClubScreen.tsx
import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  FlatList, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Search, Check } from "lucide-react-native";
import { Colors } from "@/constants/theme"; 
import { useNavigation } from "@react-navigation/native"; // 🚀 FIX 1: Using the correct router!
import { Image } from 'expo-image';
import { CLUBS } from "@/constants/clubs";

import { useAuthMutations } from "@/services/auth/auth.queries";
import { useAuthStore } from "@/store/useAuthStore";

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_COUNT = 3;
const ITEM_SIZE = (SCREEN_WIDTH - 48) / COLUMN_COUNT;

export default function SelectClubScreen() {
  const navigation = useNavigation<any>(); 
  const [search, setSearch] = useState("");
  const [selectedClub, setSelectedClub] = useState<string | null>(null);

  const { selectClubMutation } = useAuthMutations();
  const { logout } = useAuthStore();

  const handleContinue = () => {
    if (selectedClub) {
      const clubObj = CLUBS.find(c => c.id === selectedClub);
      if (clubObj) {
        // This fires the API. On success, your auth.queries.ts updates Zustand,
        // and App.tsx will automatically slide you to the next screen!
        selectClubMutation.mutate({ clubName: clubObj.name });
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}> 
           <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Select Your Club</Text>
        
        <TouchableOpacity 
           style={styles.refreshButton}
           onPress={() => {
              logout(); // Wipes Zustand, App.tsx kicks you to Login instantly
           }}
        >
            <Text style={{color: '#FF3B30', fontSize: 10, fontWeight: 'bold'}}>NUKE</Text>
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

        {/* 🚀 FIX 2: A dedicated, static Continue button instead of the Mic component */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.continueButton, (!selectedClub || selectClubMutation.isPending) && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!selectedClub || selectClubMutation.isPending}
            activeOpacity={0.8}
          >
            {selectClubMutation.isPending ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text style={[styles.continueButtonText, !selectedClub && styles.continueButtonTextDisabled]}>
                CONTINUE
              </Text>
            )}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  iconButton: { padding: 5 },
  refreshButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1F1F1F', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
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
  clubName: { color: '#555', fontSize: 12, fontWeight: '500', textAlign: 'center' },
  clubNameSelected: { color: Colors.primary, fontWeight: 'bold' },
  
  // NEW FOOTER STYLES
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#0D0D0D', 
  },
  continueButton: {
    backgroundColor: Colors.primary, 
    height: 56,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#333333', 
  },
  continueButtonText: {
    color: '#000000', 
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  continueButtonTextDisabled: {
    color: '#777777', 
  },
});