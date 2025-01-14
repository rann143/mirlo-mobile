import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePlayer } from "@/state/PlayerContext";
import { API_ROOT } from "@/constants/api-root";

export default function NextButton() {
  const {
    player,
    setCurrentSource,
    currentlyPlayingIndex,
    setCurrentlyPlayingIndex,
    playerQueue,
  } = usePlayer();
  const nextIcon = <Ionicons name="play-skip-forward" size={20} />;

  const onPress = () => {
    if (currentlyPlayingIndex === playerQueue.length - 1) {
      setCurrentlyPlayingIndex(0);
      setCurrentSource(playerQueue[0]);
      player.replace(API_ROOT + playerQueue[0].audio.url);
      player.play();
    } else {
      const nextTrackIndex = currentlyPlayingIndex + 1;
      setCurrentSource(playerQueue[nextTrackIndex]);
      setCurrentlyPlayingIndex(nextTrackIndex);
      player.replace(API_ROOT + playerQueue[nextTrackIndex].audio.url);
      player.play();
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text>{nextIcon}</Text>
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
