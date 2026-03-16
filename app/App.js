import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>STAX</Text>
      <Text style={styles.value}>$128,450</Text>
      <Text style={styles.ticker}>Trade Value Today ▲ 2.4%</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vault</Text>
        <Text style={styles.cardText}>Manage your collectibles</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pulse</Text>
        <Text style={styles.cardText}>Trade board and market activity</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Break Room</Text>
        <Text style={styles.cardText}>Live events and community breaks</Text>
      </View>

      <View style={styles.scanButton}>
        <Text style={styles.scanButtonText}>Scan Collectible</Text>
      </View>

      <View style={styles.navBar}>
        <Text style={styles.navItem}>Home</Text>
        <Text style={styles.navItem}>Vault</Text>
        <Text style={styles.navItem}>Scan</Text>
        <Text style={styles.navItem}>Profile</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
    padding: 24,
    justifyContent: "center",
  },
  logo: {
    color: "#1E7F5C",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  ticker: {
    color: "#D4AF37",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 28,
    marginTop: 6,
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardText: {
    color: "#BBBBBB",
    fontSize: 15,
  },
  scanButton: {
    backgroundColor: "#1E7F5C",
    borderRadius: 14,
    padding: 18,
    marginTop: 12,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  navItem: {
    color: "#BBBBBB",
    fontSize: 14,
    fontWeight: "600",
  },
});
