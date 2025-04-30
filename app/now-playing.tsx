import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { usePlayer } from "@/state/PlayerContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import NextButton from "@/components/NextButton";
import PrevButton from "@/components/PrevButton";
import LoopButton from "@/components/LoopButton";
import ShuffleButton from "@/components/ShuffleButton";
import Player from "@/components/Player";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import TrackPlayer, {
  State,
  PlaybackState,
  useProgress,
} from "react-native-track-player";
import Slider from "@react-native-community/slider";
import { useQuery } from "@tanstack/react-query";
import { queryAlbum } from "@/queries/queries";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NowPlaying() {
  const { activeTrack } = usePlayer() as { activeTrack: RNTrack | undefined };
  const progress = useProgress();
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{ uri: activeTrack?.trackGroup.cover.sizes[600] }}
        style={styles.image}
        resizeMode="contain"
      />
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
      <View style={{ alignItems: "center" }}>
        <View style={{ alignSelf: "flex-start", marginLeft: 20, gap: 10 }}>
          <Text style={{ fontWeight: "bold" }}>{activeTrack?.title}</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Text>From </Text>
            <Link
              href={{
                pathname: "/artist/[id]/album/[slug]/album-tracks",
                params: {
                  id: String(activeTrack?.trackGroup.artistId),
                  slug: String(activeTrack?.trackGroup.urlSlug),
                },
              }}
              asChild
            >
              <Pressable
                onPress={() => {
                  // Close current screen with animation
                  router.dismiss(1);
                }}
              >
                <Text style={styles.link}>{activeTrack?.trackGroup.title}</Text>
              </Pressable>
            </Link>
            <Text> by </Text>
            <Link
              href={{
                pathname: "/artist/[id]/artist-page",
                params: { id: String(activeTrack?.trackGroup.artistId) },
              }}
              asChild
            >
              <Pressable
                onPress={() => {
                  // Close current screen with animation
                  router.dismiss(1);
                }}
              >
                <Text style={styles.link}>{activeTrack?.artist}</Text>
              </Pressable>
            </Link>
          </View>
        </View>
        <Player />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  image: {
    width: 380,
    height: 380,
    marginVertical: 10,
    backgroundColor: "#f0f0f0", // placeholder color while loading
    alignSelf: "center",
  },
  loadSpinner: {
    flex: 1,
  },
  link: {
    color: "#BE3455",
    fontWeight: "bold",
  },
  progressBar: {
    alignSelf: "stretch",
    marginLeft: -16,
    marginRight: -20,
    padding: 0,
    marginTop: -21,
  },
});
