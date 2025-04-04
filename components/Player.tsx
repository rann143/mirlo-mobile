import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { usePlayer } from "@/state/PlayerContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import NextButton from "./NextButton";
import PrevButton from "./PrevButton";
import LoopButton from "./LoopButton";
import ShuffleButton from "./ShuffleButton";
import { Link } from "expo-router";
import TrackPlayer, {
  State,
  PlaybackState,
  useProgress,
} from "react-native-track-player";
import Slider from "@react-native-community/slider";

type PlayerStyleProps = {
  bottomDistance: number;
};

type PlayButtonProps = {
  buttonColor?: string;
};

export default function Player({ bottomDistance }: PlayerStyleProps) {
  const { activeTrack } = usePlayer();

  const progress = useProgress();
  const thisArtistId: string = String(activeTrack?.trackGroup.artistId);
  const thisSlug: string = String(activeTrack?.trackGroup.urlSlug);

  return (
    <View
      style={
        activeTrack
          ? [styles.container, { bottom: bottomDistance }]
          : { width: 0, height: 0, opacity: 0 }
      }
    >
      <View style={styles.buttonsContainer}>
        <ShuffleButton />
        <PrevButton />
        <PlayerPlayButton buttonColor="black" />
        <NextButton />
        <LoopButton />
      </View>
      <Slider
        style={styles.progressBar}
        value={progress.position}
        minimumValue={0}
        maximumValue={progress.duration}
        thumbTintColor="#BE3455"
        minimumTrackTintColor="#BE3455"
        maximumTrackTintColor="#FFF"
        onSlidingComplete={async (value) => await TrackPlayer.seekTo(value)}
      />

      <Link
        href={{
          pathname: "/artist/[id]/album/[slug]/album-tracks",
          params: { id: thisArtistId, slug: thisSlug },
        }}
      >
        {activeTrack?.title} by {activeTrack?.artist}
      </Link>
    </View>
  );
}

function PlayerPlayButton({ buttonColor }: PlayButtonProps) {
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
        console.log("play: " + playbackState.state);
      } else if (playbackState.state === State.Playing) {
        await TrackPlayer.pause();
        console.log("pause: " + playbackState.state);
      } else {
        console.log(playbackState.state);
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
          playbackState.state === State.Playing ? "pause-circle" : "play-circle"
        }
        size={75}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    alignSelf: "stretch",
    marginLeft: 5,
    marginRight: 5,
  },
  container: {
    width: "90%",
    position: "absolute",
    padding: 5,
    paddingHorizontal: 10,
    bottom: 100,
    backgroundColor: "#ededed",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 0 3 5 rgb(0, 0, 0, .5)",
    borderRadius: 10,
    zIndex: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  playPauseButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
