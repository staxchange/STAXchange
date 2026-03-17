import { ScrollView, Text, View, TouchableOpacity } from "react-native";

function MarketTicker() {
return (
<ScrollView
horizontal
showsHorizontalScrollIndicator={false}
style={{
backgroundColor: "#111",
paddingVertical: 10,
}}
>
<Text style={{ color: "#FFD700", marginHorizontal: 15 }}>
🔥 Luka Doncic Prizm RC +6% </Text>

```
  <Text style={{ color: "#FFD700", marginHorizontal: 15 }}>
    📈 Wembanyama Rookie +12%
  </Text>

  <Text style={{ color: "#FFD700", marginHorizontal: 15 }}>
    💰 Mahomes PSA10 Sale $2,450
  </Text>

  <Text style={{ color: "#FFD700", marginHorizontal: 15 }}>
    🏀 NT Break Live Now
  </Text>
</ScrollView>
```

);
}

export default function HomeScreen() {
return (
<View
style={{
flex: 1,
backgroundColor: "#000",
padding: 20,
}}
> <MarketTicker />

```
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

  <View
    style={{
      backgroundColor: "#111",
      padding: 20,
      borderRadius: 15,
      marginBottom: 15,
    }}
  >
    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
      Vault
    </Text>
    <Text style={{ color: "#aaa" }}>Manage your collectibles</Text>
  </View>

  <View
    style={{
      backgroundColor: "#111",
      padding: 20,
      borderRadius: 15,
      marginBottom: 15,
    }}
  >
    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
      Pulse
    </Text>
    <Text style={{ color: "#aaa" }}>Trade board and market activity</Text>
  </View>

  <View
    style={{
      backgroundColor: "#111",
      padding: 20,
      borderRadius: 15,
      marginBottom: 20,
    }}
  >
    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
      Break Room
    </Text>
    <Text style={{ color: "#aaa" }}>Live events and community breaks</Text>
  </View>

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
```

);
}
