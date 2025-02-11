import LoginForm from "@/components/LoginForm";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";

export default function Login() {
  return (
    <SafeAreaView style={styles.form}>
      <LoginForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: "#BE3455",
    flex: 1,
    justifyContent: "flex-start",
  },
});
