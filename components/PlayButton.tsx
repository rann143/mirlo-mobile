import Ionicons from "@expo/vector-icons/Ionicons";
import { API_ROOT } from "@/constants/api-root";
import { usePlayer } from "@/state/PlayerContext";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type PlayButtonProps = {
  audioUrlFragment: string;
  buttonColor?: string;
};

export default function PlayButton({
  audioUrlFragment,
  buttonColor,
}: PlayButtonProps) {
  const { player, isPlaying, currentSource, setCurrentSource } = usePlayer();
  const playIcon = <Ionicons name="play" size={20} />;
  const pauseIcon = <Ionicons name="pause" size={20} />;
  const audioURL = `${API_ROOT}${audioUrlFragment}`;

  function onPress() {
    // check button's associated song url against current audio source to determine
    // if we need to change the player's audio source
    if (audioURL !== currentSource) {
      player.replace(audioURL);
      player.play();
      setCurrentSource(audioURL);
      return;
    }

    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }

  return (
    <TouchableOpacity style={styles.playPauseButtonContainer} onPress={onPress}>
      <Text
        style={[
          styles.playPauseButtonText,
          { color: buttonColor ? buttonColor : "#fff" },
        ]}
      >
        {audioURL === currentSource && isPlaying ? pauseIcon : playIcon}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  playPauseButtonContainer: {
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
