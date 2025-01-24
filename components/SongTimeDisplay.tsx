import { usePlayer } from "@/state/PlayerContext";
import { useRef, useState, useEffect } from "react";
import {
  PanResponder,
  Animated,
  StyleSheet,
  View,
  LayoutChangeEvent,
} from "react-native";

type SongDisplayProps = {
  currentSeconds: number;
  duration: number;
};

export default function SongTimeDisplay({
  currentSeconds,
  duration,
}: SongDisplayProps) {
  const { player } = usePlayer();
  const isPressing = useRef(false);
  const pan = useRef(new Animated.Value(0)).current;
  const percent = currentSeconds / duration;
  const sliderWidth = useRef(0);

  useEffect(() => {
    if (!isPressing.current) {
      Animated.timing(pan, {
        toValue: percent * sliderWidth.current,
        duration: 0,
        useNativeDriver: false,
      }).start();
    }
  }, [currentSeconds, duration, pan]);

  //DRAGGING ANIMATION FUNCTINALITY NOT YET WORKING PROPERLY, TRYING TO FIGURE OUT
  //   const panResponder = useRef(
  //     PanResponder.create({
  //       onMoveShouldSetPanResponder: () => true,
  //       onPanResponderGrant: () => {
  //         isPressing.current = true; // Set onPressing to true when the interaction begins
  //         //pan.setValue(percent * duration);
  //       },
  //       onPanResponderMove: Animated.event([null, { dx: pan }], {
  //         useNativeDriver: false,
  //       }),
  //       onPanResponderRelease: (event, gestureState) => {
  //         //pan.extractOffset();
  //         player.currentTime =
  //           (gestureState.moveX / sliderWidth.current) * player.duration;
  //         //pan.setValue(gestureState.moveX);
  //         isPressing.current = false;
  //       },
  //     })
  //   ).current;

  return (
    <View
      style={styles.container}
      onLayout={(event: LayoutChangeEvent) => {
        sliderWidth.current = event.nativeEvent.layout.width;
      }}
    >
      <Animated.View
        style={[
          styles.dragger,
          {
            width: pan.interpolate({
              inputRange: [0, sliderWidth.current],
              outputRange: ["0%", "100%"],
              extrapolate: "clamp",
            }),
          },
        ]}
      />
      <Animated.View
        style={{
          borderRadius: "50%",
          width: 10,
          height: 10,
          backgroundColor: "#BE3455",
          position: "absolute",
          //right: 1,
          transform: [
            {
              translateX: pan.interpolate({
                inputRange: [0, sliderWidth.current],
                outputRange: [0, sliderWidth.current],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
        //{...panResponder.panHandlers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dragger: {
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
