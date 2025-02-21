import { usePlayer } from "@/state/PlayerContext";
import { useRef, useState, useEffect } from "react";
import { Animated, StyleSheet, View, LayoutChangeEvent } from "react-native";

type SongDisplayProps = {
  currentSeconds: number;
  duration: number;
};

export default function SongTimeDisplay({
  currentSeconds,
  duration,
}: SongDisplayProps) {
  const { isPlaying, currentSource } = usePlayer();
  const pan = useRef(new Animated.Value(0)).current;
  const [sliderWidth, setSliderWidth] = useState(0);

  useEffect(() => {
    pan.setValue(0);
  }, [currentSource]);

  useEffect(() => {
    if (isPlaying && duration > 0) {
      Animated.timing(pan, {
        toValue: (currentSeconds / duration) * sliderWidth, // Convert percent to pixel value
        useNativeDriver: false,
      }).start();
    }
  }, [currentSeconds, duration, isPlaying]);

  return (
    <View
      style={styles.container}
      onLayout={(event: LayoutChangeEvent) => {
        setSliderWidth(event.nativeEvent.layout.width);
      }}
    >
      <Animated.View
        style={[
          styles.tracker,
          {
            width: pan,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tracker: {
    backgroundColor: "#BE3455",
    height: 5,
    borderRadius: 3,
  },
  container: {
    backgroundColor: "lightgrey",
    height: 5,
    width: "100%",
    borderRadius: 3,
    marginVertical: 5,
    paddingHorizontal: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
