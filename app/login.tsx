import LoginForm from "@/components/LoginForm";
import { Text, View, SafeAreaView, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function Login() {
  return (
    <SafeAreaView style={styles.form}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#BE3455",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            width: "100%",
            height: 60,
            backgroundColor: "white",
          }}
        >
          <Pressable onPress={() => router.dismissTo("/")}>
            <Ionicons
              name="chevron-back-outline"
              size={40}
              style={{ color: "#b8b8b8" }}
            ></Ionicons>
          </Pressable>
        </View>
        <LoginForm />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "flex-start",
  },
});
