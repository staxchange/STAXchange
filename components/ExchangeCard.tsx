import { View, Text } from "react-native";

export default function ExchangeCard() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
        Card Placeholder
      </Text>

      <Text style={{ color: "#aaa", marginTop: 10 }}>
        Swipe Right = Stack
      </Text>

      <Text style={{ color: "#aaa" }}>
        Swipe Left = Pass
      </Text>
    </View>
  );
}
