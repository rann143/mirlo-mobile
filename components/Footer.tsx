import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewProps,
  Text,
  useWindowDimensions,
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
import { Pressable } from "react-native";
import { Link, router, usePathname } from "expo-router";
import { isTrackOwned } from "@/scripts/utils";
import { useAuthContext } from "@/state/AuthContext";
import { mirloRed } from "@/constants/mirlo-red";

export default function Footer({ style }: ViewProps) {
  const progress = useProgress();
  const { bottom } = useSafeAreaInsets();
  const { playableTracks, activeTrack } = usePlayer() as {
    activeTrack: RNTrack | undefined;
    playableTracks: RNTrack[];
  };
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { width, height } = useWindowDimensions();
  const size = width < 380 ? 30 : 40;
  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: bottom, height: 80 + bottom, position: "relative" },
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
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Ionicons
              name={pathname === "/" ? "home" : "home-outline"}
              accessibilityLabel="Recent Releases"
              accessibilityRole="button"
              accessibilityHint="Navigates to recent releases"
              size={size}
              color={pathname === "/" ? "#BE3455" : "#ababab"}
            ></Ionicons>
          </Pressable>

          <Pressable
            onPress={() => {
              if (!user) {
                router.push({
                  pathname: "/emailVerificationModal",
                });
              } else {
                if (pathname === "/") {
                  router.navigate("/collections");
                } else if (pathname === "/collections") {
                  return;
                } else {
                  router.dismissTo("/collections");
                }
              }
            }}
            accessibilityLabel="Your Collection"
            accessibilityRole="button"
            accessibilityHint="Navigates to your collection page"
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <Ionicons
              //name="heart-outline"
              name={pathname === "/collections" ? "library" : "library-outline"}
              size={size}
              color={pathname === "/collections" ? "#BE3455" : "#ababab"}
              style={{ marginHorizontal: 15 }}
              // #BE3455
            ></Ionicons>
          </Pressable>

          <Pressable
            onPress={() => {
              if (!user) {
                router.push({
                  pathname: "/emailVerificationModal",
                });
              } else {
                if (pathname === "/") {
                  router.navigate("/wishlist");
                } else if (pathname === "/wishlist") {
                  return;
                } else {
                  router.dismissTo("/wishlist");
                }
              }
            }}
            accessibilityLabel="Your Wishlist"
            accessibilityRole="button"
            accessibilityHint="Navigates to your wishlist page"
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <Ionicons
              //name="heart-outline"
              name={pathname === "/wishlist" ? "heart" : "heart-outline"}
              size={size}
              color={pathname === "/wishlist" ? "#BE3455" : "#ababab"}
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
          {activeTrack && activeTrack.artwork ?
<Image
              source={
                  { uri: activeTrack.artwork }
              }
              style={styles.image}
            /> : null}
          </Link>
        </View>
      </View>
    </View>
  );
}

function FooterPlayButton() {
  const { playbackState, isPlaying } = usePlayer();
  const playIcon = <Ionicons name="play" size={40} />;
  const pauseIcon = <Ionicons name="pause" size={40} />;

  async function onPress(playbackState: PlaybackState | { state: undefined }) {
    try {
      if (
        playbackState.state === State.Paused ||
        playbackState.state === State.Ready
      ) {
        await TrackPlayer.play();
        return;
      } else if (
        playbackState.state === State.Playing ||
        playbackState.state === State.Buffering
      ) {
        await TrackPlayer.pause();
        return;
      } else {
        console.error(`playback state: ${playbackState.state} not expected`);
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
        name={
          playbackState.state === State.Buffering || isPlaying
            ? "pause-outline"
            : "play"
        }
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
