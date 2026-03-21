import { View, Text } from "react-native";

export default function VaultScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Vault
      </Text>

      <Text
        style={{
          color: "#aaa",
          fontSize: 16,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        Manage your collectibles
      </Text>
    </View>
  );
}
