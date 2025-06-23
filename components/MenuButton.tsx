import { View, Pressable, ViewProps } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MenuButton({ style }: ViewProps) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => {
        router.push("/menu");
      }}
      accessibilityRole="button"
      accessibilityLabel="Menu button"
      accessibilityHint="Opens the menu page"
      style={style}
    >
      <Ionicons
        name="menu-outline"
        size={30}
        style={{ color: "#d6d6d6" }}
      ></Ionicons>
    </Pressable>
  );
}
