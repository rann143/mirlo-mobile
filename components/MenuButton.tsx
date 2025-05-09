import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MenuButton() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => {
        router.push("/menu");
      }}
      accessibilityRole="button"
      accessibilityLabel="Menu button"
      accessibilityHint="Opens the menu page"
    >
      <Ionicons
        name="menu-outline"
        size={30}
        style={{ color: "#d6d6d6", marginRight: 15 }}
      ></Ionicons>
    </Pressable>
  );
}
