import { usePlayer } from "@/state/PlayerContext";
import { useRef, useState } from "react";
import { PanResponder, Animated, StyleSheet, View } from "react-native";

type SongDisplayProps = {
  currentSeconds: number;
  duration: number;
};

export default function SongTimeDisplay({
  currentSeconds,
  duration,
}: SongDisplayProps) {
  const { player } = usePlayer();
  const pan = useRef(new Animated.Value(0)).current;
  const percent = currentSeconds / duration;

  //DRAGGING ANIMATION FUNCTINALITY NOT YET WORKING PROPERLY, TRYING TO FIGURE OUT
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (event, gestureState) => {
        pan.extractOffset();
        player.seekBy(gestureState.dx);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={[styles.dragger, { width: `${percent * 100}%` }]}>
        <View
          style={[
            {
              borderRadius: "50%",
              width: 10,
              height: 10,
              backgroundColor: "#BE3455",
              position: "absolute",
              right: -9,
              bottom: -3,
              opacity: 1,
            },
          ]}
        ></View>
      </View>
      {/* <Animated.View
        style={{
          borderRadius: "50%",
          width: 10,
          height: 10,
          backgroundColor: "#BE3455",
          right: 1,
          transform: [{ translateX: pan }],
        }}
        {...panResponder.panHandlers}
      /> */}
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
