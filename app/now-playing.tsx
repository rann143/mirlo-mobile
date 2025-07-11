import {
  Text,
  View,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { usePlayer } from "@/state/PlayerContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import Player from "@/components/Player";
import { Link, useRouter } from "expo-router";
import TrackPlayer, { useProgress } from "react-native-track-player";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NowPlaying() {
  const { activeTrack, shuffled } = usePlayer() as {
    activeTrack: RNTrack | undefined;
    shuffled: boolean;
  };
  const progress = useProgress();
  const router = useRouter();
  const { width } = useWindowDimensions();

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
        <Pressable onPress={() => router.dismiss()}>
          <Ionicons
            name="chevron-down-outline"
            size={40}
            style={{ color: "#696969" }}
          ></Ionicons>
        </Pressable>
      </View>

      <Image
        source={{ uri: activeTrack?.trackGroup.cover.sizes[600] }}
        style={[styles.image, { width: width }]}
        resizeMode="cover"
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: width + 40,
        }}
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
            justifyContent: "space-between",
            width: width,
            paddingHorizontal: 5,
          }}
        >
          <Text>{formatTime(progress.position)}</Text>
          <Text>{formatTime(progress.duration)}</Text>
        </View>
      </View>
      <View
        style={{
          alignSelf: "flex-start",
          margin: 20,
          gap: 10,
          maxWidth: width - 50,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{activeTrack?.title}</Text>
        <View
          style={{
            display: "flex",
          }}
        >
          <View style={{ flexDirection: "row" }}>
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
                style={{ flexShrink: 1 }}
                onPress={() => {
                  router.dismiss(1);
                }}
              >
                <Text
                  style={[styles.link, { maxWidth: "100%" }]}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {activeTrack?.trackGroup.title}
                </Text>
              </Pressable>
            </Link>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>by </Text>
            <Link
              href={{
                pathname: "/artist/[id]/artist-page",
                params: { id: String(activeTrack?.trackGroup.artistId) },
              }}
              asChild
            >
              <Pressable
                style={{ flexShrink: 1 }}
                onPress={() => {
                  router.dismiss(1);
                }}
              >
                <Text
                  style={styles.link}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {activeTrack?.artist}
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
      <Player
        style={{
          width: width,
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      />
    </SafeAreaView>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Number(seconds.toFixed(0)) % 60;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    height: 380,
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
    width: "100%",
  },
});
