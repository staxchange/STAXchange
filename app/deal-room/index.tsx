import { View, Text } from "react-native";

export default function BreakRoomScreen() {
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
        Break Room
      </Text>

      <Text
        style={{
          color: "#aaa",
          fontSize: 16,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        Live events and community breaks
      </Text>
    </View>
  );
}
