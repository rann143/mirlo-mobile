import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function SearchButton() {
  const router = useRouter();
  return (
    <Pressable
      accessibilityLabel="Search"
      accessibilityHint="Opens the search bar"
      accessibilityRole="button"
      style={{ flex: 1 }}
      onPress={() => router.push("/search")}
    >
      <Ionicons
        name="search-outline"
        size={30}
        style={{ color: "#d6d6d6" }}
      ></Ionicons>
    </Pressable>
  );
}
