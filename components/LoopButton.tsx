import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePlayer } from "@/state/PlayerContext";
import { API_ROOT } from "@/constants/api-root";

export default function LoopButton() {
  const { player, setCurrentSource, looping, setLooping } = usePlayer();
  const loopIcon = (
    <Ionicons
      name="repeat"
      size={20}
      color={
        looping === "loopQueue" || looping === "loopTrack" ? "#BE3455" : "black"
      }
    />
  );

  const onPress = () => {
    if (looping === "none") {
      setLooping("loopQueue");
    } else if (looping === "loopQueue") {
      setLooping("loopTrack");
    } else {
      setLooping("none");
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text>{loopIcon}</Text>
        {looping === "loopTrack" && <LoopIndicator />}
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
    paddingHorizontal: 12,
    marginRight: 10,
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
