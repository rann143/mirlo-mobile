import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewProps,
} from "react-native";
import Slider from "@react-native-community/slider";
import TrackPlayer, {
  PlaybackState,
  State,
  useProgress,
} from "react-native-track-player";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePlayer } from "@/state/PlayerContext";
import { useEffect } from "react";
import { Pressable } from "react-native";
import {
  Link,
  router,
  usePathname,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { isTrackOwned } from "@/scripts/utils";
import { useAuthContext } from "@/state/AuthContext";

export default function Footer({ style }: ViewProps) {
  const progress = useProgress();
  const { bottom } = useSafeAreaInsets();
  const { playableTracks, activeTrack } = usePlayer() as {
    activeTrack: RNTrack | undefined;
    playableTracks: RNTrack[];
  };
  const pathname = usePathname();
  const segments = useSegments();
  const { user } = useAuthContext();
  const inCollection = isTrackOwned(playableTracks[0], undefined, user);
  return (
    <View
      style={[
        styles.footer,
        { marginBottom: bottom, height: 80, position: "relative" },
        style,
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
              name={pathname === "/" ? "home" : "home-outline"}
              accessibilityLabel="Recent Releases"
              accessibilityRole="button"
              accessibilityHint="Navigates to recent releases"
              size={40}
              color={pathname === "/" ? "#BE3455" : "#d6d6d6"}
              style={{ marginRight: 15 }}
            ></Ionicons>
          </Pressable>

          <Pressable
            onPress={() => {
              if (pathname === "/") {
                router.navigate("/collections");
              } else if (pathname === "/collections") {
                return;
              } else {
                router.dismissTo("/collections");
              }
            }}
            accessibilityLabel="Your Collection"
            accessibilityRole="button"
            accessibilityHint="Navigates to your collection page"
          >
            <Ionicons
              //name="heart-outline"
              name={pathname === "/collections" ? "heart" : "heart-outline"}
              size={40}
              color={pathname === "/collections" ? "#BE3455" : "#d6d6d6"}
              style={{ marginLeft: 15 }}
              // #BE3455
            ></Ionicons>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            height: "100%",
            alignItems: "center",
            marginTop: -20,
          }}
        >
          {activeTrack && <FooterPlayButton />}
          <Link
            href={{
              pathname: "/now-playing",
              params: {
                id: activeTrack?.trackGroup.artistId,
                slug: activeTrack?.trackGroup.urlSlug,
              },
            }}
            disabled={activeTrack ? false : true}
          >
            <Image
              source={
                activeTrack && activeTrack.artwork
                  ? { uri: activeTrack.artwork }
                  : require("@/assets/images/mirlo-logo-logoOnly-light.png")
              }
              style={styles.image}
            />
          </Link>
        </View>
      </View>
    </View>
  );
}

function FooterPlayButton() {
  const { playbackState } = usePlayer();
  const playIcon = <Ionicons name="play" size={40} />;
  const pauseIcon = <Ionicons name="pause" size={40} />;

  async function onPress(playbackState: PlaybackState | { state: undefined }) {
    try {
      if (
        playbackState.state === State.Paused ||
        playbackState.state === State.Ready
      ) {
        await TrackPlayer.play();
      } else if (playbackState.state === State.Playing) {
        await TrackPlayer.pause();
      } else {
      }
    } catch (error) {
      console.error("issue with player toggle playback botton", error);
    }
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => onPress(playbackState)}
    >
      <Ionicons
        name={playbackState.state === State.Playing ? "pause-outline" : "play"}
        size={40}
      />
    </TouchableOpacity>
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
    //marginTop: -20,
  },
  button: {
    // borderWidth: 1,
    // borderColor: "black",
    //marginTop: -20,
    height: "100%",
    justifyContent: "center",
    marginRight: 10,
  },
});
