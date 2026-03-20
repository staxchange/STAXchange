import { View, Text, TouchableOpacity } from "react-native";

export default function SectionCard({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
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
    </TouchableOpacity>
  );
}
