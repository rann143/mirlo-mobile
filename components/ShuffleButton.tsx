import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePlayer } from "@/state/PlayerContext";
import { API_ROOT } from "@/constants/api-root";
import { shuffle, pullAt } from "lodash";

export default function ShuffleButton() {
  const {
    player,
    isPlaying,
    currentSource,
    setCurrentSource,
    currentlyPlayingIndex,
    setCurrentlyPlayingIndex,
    playerQueue,
    setPlayerQueue,
    shuffled,
    setShuffled,
  } = usePlayer();
  const shuffleIcon = (
    <Ionicons name="shuffle" size={20} color={shuffled ? "#BE3455" : "black"} />
  );

  const onPress = () => {
    if (!shuffled) {
      let shuffled: TrackProps[] = [];
      if (isPlaying) {
        const queueCopy = [...playerQueue];
        const currentTrack = pullAt(queueCopy, currentlyPlayingIndex);
        shuffled = [...currentTrack, ...shuffle(queueCopy)];
      } else {
        shuffled = shuffle(playerQueue);
      }
      setPlayerQueue(shuffled);
      setShuffled(true);
    } else {
      setShuffled(false);
      let unshuffled: TrackProps[] = new Array(playerQueue.length);
      for (let i = 0; i < playerQueue.length; i++) {
        unshuffled[playerQueue[i].order - 1] = playerQueue[i];
      }
      setPlayerQueue(unshuffled);
      if (currentSource) setCurrentlyPlayingIndex(currentSource.order - 1);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text>{shuffleIcon}</Text>
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
