import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePlayer } from "@/state/PlayerContext";
import { API_ROOT } from "@/constants/api-root";

export default function PrevButton() {
  const {
    player,
    setCurrentSource,
    currentlyPlayingIndex,
    setCurrentlyPlayingIndex,
    playerQueue,
  } = usePlayer();
  const prevIcon = <Ionicons name="play-skip-back" size={20} />;

  const onPress = () => {
    if (player.currentTime > 3) {
      // We want to pause, then play so our PlayerSlider re-renders its current time.
      // If we just replay, the player just seeks it's playback to the beginning without ever pausing
      player.pause();
      player.replay();
      player.play();
      return;
    }

    if (currentlyPlayingIndex === 0) {
      setCurrentlyPlayingIndex(playerQueue.length - 1);
      setCurrentSource(playerQueue[playerQueue.length - 1]);
      player.replace(API_ROOT + playerQueue[playerQueue.length - 1].audio.url);
      player.play();
    } else {
      const prevTrackIndex = currentlyPlayingIndex - 1;
      setCurrentSource(playerQueue[prevTrackIndex]);
      setCurrentlyPlayingIndex(prevTrackIndex);
      player.replace(API_ROOT + playerQueue[prevTrackIndex].audio.url);
      player.play();
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text>{prevIcon}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
  },
});
