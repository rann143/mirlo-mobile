import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
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

  const logInIcon = <Feather name="log-in" size={24} color="black" />;
  const logOutIcon = <Feather name="log-out" size={24} color="black" />;

  if (!user) {
    return (
      <Link href={{ pathname: "/login" }} style={styles.link}>
        {logInIcon}
      </Link>
    );
  }

  return (
    <TouchableOpacity onPress={onLogOut} style={styles.link}>
      <Text>{logOutIcon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: { marginRight: 15 },
});
