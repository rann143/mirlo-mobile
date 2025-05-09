import { Dimensions, View, Pressable, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/state/AuthContext";
import { useLogoutMutation } from "@/queries/authQueries";

export default function Menu() {
  const router = useRouter();
  const { user } = useAuthContext();

  const { mutate: logout } = useLogoutMutation();
  const onLogOut = () => {
    logout(undefined, {
      onSuccess() {
        router.dismissTo("/");
        console.log("logged out");
      },
    });
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 30,
        width: "100%",
        backgroundColor: "white",
      }}
    >
      {user ? (
        <View>
          <Text style={{ margin: 20, fontSize: 25, fontWeight: "bold" }}>
            Hi, {user.name}!
          </Text>
          <View style={styles.separator} />
        </View>
      ) : (
        <></>
      )}
      <View style={{ gap: 20, alignItems: "center", width: "100%" }}>
        <Pressable
          onPress={() => {
            router.back();
            router.navigate("/");
          }}
          style={styles.link}
        >
          <Ionicons name="home-outline" size={25} />
          <Text style={{ fontSize: 20 }}>Recent Releases</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            router.back();
            router.navigate("/collections");
          }}
          style={styles.link}
        >
          <Ionicons name="heart-outline" size={25} />
          <Text style={{ fontSize: 20 }}>Your Collection</Text>
        </Pressable>
        <Pressable
          style={[
            styles.link,
            {
              borderColor: "#e0e0e0",
              borderWidth: StyleSheet.hairlineWidth,
              backgroundColor: "white",
              marginTop: 20,
            },
          ]}
          onPress={() => {
            if (user) {
              onLogOut();
              return;
            } else {
              router.dismissTo("/login");
            }
          }}
        >
          <Ionicons name="exit-outline" size={25} />
          <Text style={{ fontSize: 20 }}>{user ? "Logout" : "Login"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  separator: {
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 20,
  },
  link: {
    backgroundColor: "#edebeb",
    flexDirection: "row",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    gap: 10,
  },
});
