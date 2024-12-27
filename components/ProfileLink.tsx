import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";

export default function ProfileLink() {
  const icon = <Feather name="user" size={24} color="black" />;
  return (
    <Link href={{ pathname: "/login" }} style={styles.link}>
      {icon}
    </Link>
  );
}

const styles = StyleSheet.create({
  link: { marginRight: 15 },
});
