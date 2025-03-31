import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePlayer } from "@/state/PlayerContext";
import { API_ROOT } from "@/constants/api-root";
import TrackPlayer, { PlaybackState } from "react-native-track-player";

export default function NextButton() {
  const { setActiveTrack } = usePlayer();
  const nextIcon = <Ionicons name="play-skip-forward" size={20} />;

  const nextSong = async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      const trackIndex = await TrackPlayer.getActiveTrackIndex();
      const queueLength = queue.length;

      if (trackIndex === queueLength - 1) {
        await TrackPlayer.skip(0);
      } else {
        await TrackPlayer.skipToNext();
      }

      const newTrack = (await TrackPlayer.getActiveTrack()) as RNTrack;
      if (newTrack) {
        setActiveTrack(newTrack);
      } else {
        throw new Error("Couldn't get next Track");
      }
    } catch (err) {
      console.error("issue skipping to next song", err);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={nextSong}>
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
