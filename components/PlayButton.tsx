import Ionicons from "@expo/vector-icons/Ionicons";
import { API_ROOT } from "@/constants/api-root";
import { usePlayer } from "@/state/PlayerContext";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useCallback, useState, useEffect } from "react";
import TrackPlayer, { PlaybackState, State } from "react-native-track-player";
import { isEqual } from "lodash";

export default function PlayButton({
  albumTracks,
  trackObject,
  buttonColor,
}: PlayButtonProps) {
  const { playbackState, album, activeTrack, setActiveTrack } = usePlayer();
  const audioURL = trackObject?.url;

  const togglePlayBack = async (
    playBackState: PlaybackState | { state: undefined }
  ) => {
    try {
      const queue = await TrackPlayer.getQueue();
      // Set queue if no queue currently set
      if (!queue) {
        console.log("no curr track: setting track");
        await TrackPlayer.setQueue(album);
        await TrackPlayer.load(trackObject);
        await TrackPlayer.play();
        setActiveTrack(trackObject);
        return;
      }

      const currentTrack = await TrackPlayer.getActiveTrack();

      const isSameAlbum =
        currentTrack?.trackGroup.urlSlug === trackObject.trackGroup.urlSlug
          ? true
          : false;

      // Song Change to different album
      if (!isSameAlbum) {
        try {
          await TrackPlayer.setQueue(album);
          await TrackPlayer.load(trackObject);
          await TrackPlayer.play();
          setActiveTrack(trackObject);
          return;
        } catch (err) {
          console.error("issue changing albums", err);
          return;
        }
      }

      // Song Change within same album
      if (currentTrack?.url !== audioURL) {
        setActiveTrack(trackObject);
        await TrackPlayer.skip(trackObject.order - 1);
        await TrackPlayer.play();
        return;
      } else {
        if (
          playbackState.state === State.Paused ||
          playbackState.state === State.Ready
        ) {
          await TrackPlayer.play();
        } else {
          await TrackPlayer.pause();
        }
      }
    } catch (err) {
      console.error("issue with playback", err);
    }
  };

  return (
    <TouchableOpacity onPress={() => togglePlayBack(playbackState)}>
      <Ionicons
        name={
          playbackState.state === State.Playing && activeTrack?.url === audioURL
            ? "pause"
            : "play"
        }
        size={40}
        style={{ marginHorizontal: 5 }}
        color="black"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  playPauseButtonContainer: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 0,
  },
  playPauseButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
