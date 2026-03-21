import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import MarketTicker from "../../components/MarketTicker";
import SectionCard from "../../components/SectionCard";

export default function ExchangeScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        padding: 20,
      }}
    >
      <MarketTicker />

      <Text
        style={{
          color: "#2e8b57",
          fontSize: 32,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        STAX
      </Text>

      <Text
        style={{
          color: "#fff",
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 10,
        }}
      >
        $128,450
      </Text>

      <Text
        style={{
          color: "#FFD700",
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Trade Value Today ▲ 2.4%
      </Text>

      <SectionCard
        title="Vault"
        subtitle="Manage your collectibles"
        onPress={() => router.push("/vault")}
      />

      <SectionCard
        title="Trade Board"
        subtitle="Recent completed public deals and transactions"
        onPress={() => router.push("/trade-board")}
      />

      <SectionCard
        title="Break Room"
        subtitle="Live events and community breaks"
        onPress={() => router.push("/break-room")}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#2e8b57",
          padding: 18,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Scan Collectible
        </Text>
      </TouchableOpacity>
    </View>
  );
}
