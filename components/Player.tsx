import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { usePlayer } from "@/state/PlayerContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { API_ROOT } from "@/constants/api-root";
import NextButton from "./NextButton";
import PrevButton from "./PrevButton";
import LoopButton from "./LoopButton";
import ShuffleButton from "./ShuffleButton";

export default function Player() {
  const { player, isPlaying, currentSource, setCurrentSource } = usePlayer();

  return (
    <View
      style={
        currentSource ? styles.container : { width: 0, height: 0, opacity: 0 }
      }
    >
      <View style={styles.buttonsContainer}>
        <ShuffleButton />
        <PrevButton />
        <PlayerPlayButton buttonColor="black" />
        <NextButton />
        <LoopButton />
      </View>
      <Text>
        {currentSource?.title} by {currentSource?.artist}
      </Text>
    </View>
  );
}

type PlayButtonProps = {
  buttonColor?: string;
};

function PlayerPlayButton({ buttonColor }: PlayButtonProps) {
  const { player, isPlaying, currentSource, setCurrentSource } = usePlayer();
  const playIcon = <Ionicons name="play" size={20} />;
  const pauseIcon = <Ionicons name="pause" size={20} />;

  function onPress() {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text
        style={[
          styles.playPauseButtonText,
          { color: buttonColor ? buttonColor : "#fff" },
        ]}
      >
        {isPlaying ? pauseIcon : playIcon}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    position: "absolute",
    padding: 5,
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
