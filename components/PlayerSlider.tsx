import { usePlayer } from "@/state/PlayerContext";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import SongTimeDisplay from "./SongTimeDisplay";

export default function PlayerSlider() {
  const { player, trackDuration, isPlaying } = usePlayer();
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (currentTime !== player.currentTime) {
      setCurrentTime(player.currentTime);
    }

    if (isPlaying) {
      interval = setInterval(
        () => setCurrentTime((prevTime) => prevTime + 1),
        1000
      );
    } else if (interval !== undefined) {
      clearInterval(interval);
    }

    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [isPlaying]);

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Number(seconds.toFixed(0)) % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <View
      style={{
        width: "100%",

        paddingTop: 1,
        paddingBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ marginHorizontal: 5 }}>{formatTime(currentTime)}</Text>
        <Text style={{ marginHorizontal: 5 }}>{formatTime(trackDuration)}</Text>
      </View>
      <SongTimeDisplay currentSeconds={currentTime} duration={trackDuration} />
    </View>
  );
}
