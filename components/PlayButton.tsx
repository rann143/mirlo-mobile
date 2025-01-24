import Ionicons from "@expo/vector-icons/Ionicons";
import { API_ROOT } from "@/constants/api-root";
import { usePlayer } from "@/state/PlayerContext";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useCallback, useState, useEffect } from "react";

type PlayButtonProps = {
  albumTracks: Array<TrackProps>;
  trackObject: TrackProps;
  buttonColor?: string;
};

export default function PlayButton({
  albumTracks,
  trackObject,
  buttonColor,
}: PlayButtonProps) {
  const {
    player,
    isPlaying,
    currentSource,
    setCurrentSource,
    setPlayerQueue,
    setCurrentlyPlayingIndex,
    setShuffled,
    shuffled,
  } = usePlayer();
  //const [localPlaying, setLocalPlaying] = useState(false);
  const playIcon = <Ionicons name="play" size={20} />;
  const pauseIcon = <Ionicons name="pause" size={20} />;
  const audioUrlFragment = trackObject.audio.url;
  const audioURL = `${API_ROOT}${audioUrlFragment}`;

  const onPress = async () => {
    // check if currentSource is null to determine if we should initialize it
    if (!currentSource) {
      player.replace(audioURL);
      player.play();
      setCurrentSource(trackObject);
      setPlayerQueue(albumTracks);
      return;
    }

    // compare album of this track againstour current source's album to determine
    // if we need to reset our queue
    if (trackObject.albumId !== currentSource.albumId) {
      if (shuffled) {
        setShuffled(false);
      }
      setPlayerQueue(albumTracks);
    }

    // check button's associated song url against current audio source to determine
    // if we need to change the player's audio source
    if (audioUrlFragment !== currentSource?.audio.url) {
      //setLocalPlaying(true);
      setCurrentSource(trackObject);
      setCurrentlyPlayingIndex(trackObject.order - 1);
      player.replace(audioURL);
      player.play();
      return;
    }

    if (isPlaying) {
      player.pause();
      //setLocalPlaying(false);
    } else {
      player.play();
      //setLocalPlaying(true);
    }
  };

  return (
    <TouchableOpacity
      style={styles.playPauseButtonContainer}
      onPress={onPress}
      activeOpacity={1}
    >
      <Text
        style={[
          styles.playPauseButtonText,
          { color: buttonColor ? buttonColor : "#fff" },
        ]}
      >
        {isPlaying && currentSource?.audio.url === audioUrlFragment
          ? pauseIcon
          : playIcon}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  playPauseButtonContainer: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  playPauseButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
