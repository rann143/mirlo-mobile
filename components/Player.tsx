import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { usePlayer } from "@/state/PlayerContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { API_ROOT } from "@/constants/api-root";
import NextButton from "./NextButton";
import PrevButton from "./PrevButton";
import LoopButton from "./LoopButton";
import ShuffleButton from "./ShuffleButton";
import PlayerSlider from "./PlayerSlider";
import { Link } from "expo-router";
import SongTimeDisplay from "./SongTimeDisplay";
import TrackPlayer, { State, PlaybackState } from "react-native-track-player";

type PlayerStyleProps = {
  bottomDistance: number;
};

type PlayButtonProps = {
  buttonColor?: string;
};

export default function Player({ bottomDistance }: PlayerStyleProps) {
  const { activeTrack } = usePlayer();

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
        {/* <ShuffleButton />
        <PrevButton /> */}
        <PlayerPlayButton buttonColor="black" />
        {/* <NextButton />
        <LoopButton /> */}
      </View>
      {/* <PlayerSlider /> */}

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
    if (
      playbackState.state === State.Paused ||
      playbackState.state === State.Ready
    ) {
      console.log("play");
      await TrackPlayer.play();
    } else {
      console.log("pause");
      await TrackPlayer.pause();
    }
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => onPress(playbackState)}
    >
      <Ionicons
        name={
          playbackState.state === State.Playing
            ? "pause-circle"
            : // : playbackState.state === State.Loading &&
              //   activeTrack?.url == audioURL
              // ? "caret-down-circle"
              "play-circle"
        }
        size={75}
        color="#FFD369"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 12,
    marginRight: 10,
  },
  playPauseButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
