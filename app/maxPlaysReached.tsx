import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  SectionList,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import TrackPlayer from "react-native-track-player";
import { usePlayer } from "@/state/PlayerContext";
import { mirloRed } from "@/constants/mirlo-red";

export default function MaxPlaysReached() {
  const router = useRouter();
  const { activeTrack } = usePlayer();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: 60,
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
        <Text style={{ fontSize: 20, color: "white" }}>
          You are out of free plays for the track
        </Text>
        <Text style={{ fontSize: 20, marginBottom: 20, color: "white" }}>
          "{activeTrack?.title}"
        </Text>

        <Pressable
          onPress={() =>
            Linking.openURL(
              `https://mirlo.space/${activeTrack?.trackGroup.artist.urlSlug}/release/${activeTrack?.trackGroup.urlSlug}`
            )
          }
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
            Buy Album "{activeTrack?.trackGroup.title}"
          </Text>
        </Pressable>

        {activeTrack?.allowIndividualSale ? (
          <Text
            style={{
              color: "white",
              fontSize: 20,
              margin: 10,
            }}
          >
            OR
          </Text>
        ) : null}

        {activeTrack?.allowIndividualSale ? (
          <Pressable
            onPress={() =>
              Linking.openURL(
                `https://mirlo.space/${activeTrack?.trackGroup.artist.urlSlug}/release/${activeTrack?.trackGroup.urlSlug}/tracks/${activeTrack?.id}`
              )
            }
            style={{
              alignItems: "center",
              marginVertical: 10,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 20,
                margin: 10,
                textAlign: "center",
              }}
            >
              Buy Track "{activeTrack?.title}"
            </Text>
          </Pressable>
        ) : null}

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
