import { View, Text } from "react-native";

export default function TradeBoardScreen() {
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
        Trade Board
      </Text>

      <Text
        style={{
          color: "#aaa",
          fontSize: 16,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        Recent completed public deals and transactions
      </Text>
    </View>
  );
}
