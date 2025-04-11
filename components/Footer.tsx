import { View, StyleSheet, Image } from "react-native";
import Slider from "@react-native-community/slider";
import TrackPlayer, { useProgress } from "react-native-track-player";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePlayer } from "@/state/PlayerContext";
import { useEffect } from "react";
import { Pressable } from "react-native";
import { router } from "expo-router";

export default function Footer() {
  const progress = useProgress();
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        { marginBottom: bottom, height: 80, position: "relative" },
      ]}
    >
      <Slider
        style={styles.progressBar}
        value={progress.position}
        minimumValue={0}
        maximumValue={progress.duration}
        thumbTintColor="transparent"
        minimumTrackTintColor="#BE3455"
        maximumTrackTintColor="#d6d6d6"
        onSlidingComplete={async (value) => await TrackPlayer.seekTo(value)}
      />
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: "100%",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            height: "100%",
            alignItems: "center",
            marginLeft: 20,
            marginTop: -20,
          }}
        >
          <Pressable
            onPress={() => {
              router.dismissTo("/");
            }}
          >
            <Ionicons
              name="home-outline"
              size={40}
              style={{ color: "#d6d6d6", marginRight: 15 }}
            ></Ionicons>
          </Pressable>

          <Pressable
            onPress={() => {
              router.push("/collections");
            }}
          >
            <Ionicons
              name="heart-outline"
              size={40}
              style={{ color: "#d6d6d6", marginLeft: 15 }}
            ></Ionicons>
          </Pressable>
        </View>
        <Image
          source={require("@/assets/images/mirlo-logo-logoOnly-dark.png")}
          style={styles.image}
        ></Image>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    backgroundColor: "white",
    // borderWidth: 1,
    // borderColor: "black",
  },
  progressBar: {
    alignSelf: "stretch",
    marginLeft: -16,
    marginRight: -20,
    padding: 0,
    marginTop: -21,
  },
  image: {
    width: 80,
    height: "100%",
    marginTop: -20,
  },
});
