import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePlayer } from "@/state/PlayerContext";
import { API_ROOT } from "@/constants/api-root";
import TrackPlayer, { RepeatMode } from "react-native-track-player";
import { useState } from "react";

export default function LoopButton() {
  // const [looping, setLooping] = useState<"none" | "track" | "queue">("none");
  const { looping, setLooping } = usePlayer();
  const loopIcon = (
    <Ionicons
      name="repeat"
      size={30}
      color={looping === "queue" || looping === "track" ? "#BE3455" : "black"}
    />
  );

  const onPress = async () => {
    try {
      if (looping === "none") {
        setLooping("queue");
        await TrackPlayer.setRepeatMode(RepeatMode.Queue);
      } else if (looping === "queue") {
        setLooping("track");
        await TrackPlayer.setRepeatMode(RepeatMode.Track);
      } else {
        setLooping("none");
        await TrackPlayer.setRepeatMode(RepeatMode.Off);
      }
    } catch (err) {
      console.error("Issue setting loop mode");
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text>{loopIcon}</Text>
        {looping === "track" && <LoopIndicator />}
      </TouchableOpacity>
    </View>
  );
}

const LoopIndicator = () => {
  return (
    <View style={{ position: "absolute", right: 10, top: 5 }}>
      <Text style={styles.loopIndicator}>1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    position: "relative",
  },
  loopingQueue: {
    color: "#BE3455",
  },
  loopIndicator: {
    fontSize: 12,
    color: "#BE3455",
  },
});
