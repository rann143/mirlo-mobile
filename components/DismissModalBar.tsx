import { View, Pressable, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function DismissModalBar() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: height * 0.08,
        backgroundColor: "#fafafa",
      }}
    >
      <Pressable
        onPress={() => router.dismiss()}
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Ionicons
          name="chevron-down-outline"
          size={40}
          style={{ color: "#696969" }}
        ></Ionicons>
      </Pressable>
    </View>
  );
}
