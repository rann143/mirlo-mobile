import DismissModalBar from "@/components/DismissModalBar";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import * as api from "../queries/fetch/fetchWrapper";
import { useState } from "react";
import { useAuthContext } from "@/state/AuthContext";
import { usePlayer } from "@/state/PlayerContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { mirloRed } from "@/constants/mirlo-red";

export default function EmailPurchaseInfoModal() {
  const router = useRouter();
  const { activeTrack } = usePlayer();
  const { user } = useAuthContext();
  const [isEmailSent, setIsEmailSent] = useState<Boolean>(false);

  function sendPurchaseEmail() {
    try {
      if (activeTrack && user) {
        api.post(
          `/v1/trackGroups/${activeTrack.trackGroup.id}/emailPurchaseLink?email=${user?.email}`,
          {}
        );
        setIsEmailSent(true);
      } else {
        console.log("Missing active track or user email");
      }
    } catch (err) {
      console.error("issue emailing purchase info", err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <DismissModalBar />

      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 50,
          width: "100%",
          backgroundColor: mirloRed,
        }}
      >
        {!user && (
          <Text
            style={{
              fontSize: 20,
              color: "white",
              margin: 10,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Log In or Sign Up for Purchase Info!
          </Text>
        )}
        {user && !isEmailSent && (
          <Pressable
            onPress={() => {
              sendPurchaseEmail();
            }}
            style={{
              alignItems: "center",
              marginBottom: 10,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "black",
                margin: 10,
                textAlign: "center",
              }}
            >
              Email Purchase Info
            </Text>
          </Pressable>
        )}
        {user && isEmailSent && (
          <Pressable
            style={{
              alignItems: "center",
              marginBottom: 10,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "black",
                margin: 10,
                textAlign: "center",
              }}
            >
              Email Sent! ✅
            </Text>
          </Pressable>
        )}
        <Text
          style={{
            fontSize: 20,
            color: "white",
            alignSelf: "flex-start",
            marginTop: 20,
          }}
        >
          Buy this {activeTrack?.allowIndividualSale ? "track" : "album"} to:
        </Text>
        <FlatList
          style={{ margin: 10 }}
          data={[
            { text: `Support ${activeTrack?.artist}` },
            { text: "Get unlimited streaming" },
            { text: "Get high quality downloads" },
          ]}
          renderItem={({ item }) => (
            <Text style={{ color: "white", fontSize: 17, margin: 5 }}>
              • {item.text}
            </Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
