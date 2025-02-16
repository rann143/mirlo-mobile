import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAuthContext } from "@/state/AuthContext";
import { useLogoutMutation } from "@/queries/authQueries";
import { useCallback } from "react";
import { useRouter } from "expo-router";

export default function ProfileLink() {
  const { user } = useAuthContext();
  const { mutate: logout } = useLogoutMutation();
  const router = useRouter();
  const onLogOut = () => {
    logout(undefined, {
      onSuccess() {
        router.replace("/");
        console.log("logged out");
      },
    });
  };

  const logInIcon = <Feather name="log-in" size={20} color="black" />;
  const logOutIcon = <Feather name="log-out" size={20} color="black" />;

  if (!user) {
    return (
      <View style={styles.link}>
        <Link href={{ pathname: "/login" }}>
          <View>
            <Text>{logInIcon}</Text>
            <Text>Login</Text>
          </View>
        </Link>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onLogOut} style={styles.link}>
      <Text>{logOutIcon}</Text>
      <Text>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
