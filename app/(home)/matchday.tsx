import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function MatchdayScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>MATCHDAY CENTER 🏟️</Text>
      <Text style={styles.subtext}>Live scores and viewing center coming here.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#CCFF00', // Neon Green
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtext: {
    color: 'gray',
    marginTop: 10,
  }
});