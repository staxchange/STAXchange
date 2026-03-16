import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>STAX</Text>
      <Text style={styles.subtitle}>Your Digital Collectibles Vault</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#00FF88",
    fontSize: 48,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#ccc",
    fontSize: 18,
    marginTop: 10,
  },
});
