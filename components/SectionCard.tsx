import { View, Text } from "react-native";

export default function SectionCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "#111",
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
        {title}
      </Text>
      <Text style={{ color: "#aaa" }}>{subtitle}</Text>
    </View>
  );
}
