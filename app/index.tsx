import { ScrollView, Text, View } from "react-native";

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
      <Text style={{color:"#FFD700", marginHorizontal:15}}>
        🔥 Luka Doncic Prizm RC +6%
      </Text>

      <Text style={{color:"#FFD700", marginHorizontal:15}}>
        📈 Wembanyama Rookie +12%
      </Text>

      <Text style={{color:"#FFD700", marginHorizontal:15}}>
        💰 Mahomes PSA10 Sale $2,450
      </Text>

      <Text style={{color:"#FFD700", marginHorizontal:15}}>
        🏀 NT Break Live Now
      </Text>
    </ScrollView>
  );
}
