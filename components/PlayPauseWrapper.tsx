import Ionicons from "@expo/vector-icons/Ionicons";
import { API_ROOT } from "@/constants/api-root";
import { usePlayer } from "@/state/PlayerContext";
import { TouchableOpacity, Text, StyleSheet, Pressable } from "react-native";
import {
  useCallback,
  useState,
  useEffect,
  PropsWithChildren,
  useRef,
} from "react";
import TrackPlayer, { PlaybackState, State } from "react-native-track-player";
import { isEqual } from "lodash";
import { TrackItem } from "./TrackItem";
import { isTrackOwnedOrPreview } from "@/scripts/utils";
import { useAuthContext } from "@/state/AuthContext";

type PlayPauseWrapper = PropsWithChildren<PlayPauseWrapperProps>;

export default function PlayPauseWrapper({
  trackObject,
  children,
  style,
  selectedAlbum,
}: PlayPauseWrapper) {
  const { playbackState, playableTracks, activeTrack, setActiveTrack } =
    usePlayer();
  const audioURL = trackObject?.url;
  const [thisSongSelected, setThisSongSelected] = useState<boolean>(false);
  const { user } = useAuthContext();
  const trackPlayerInfo = useRef(null);

  const canPlayTrack = isTrackOwnedOrPreview(trackObject, user, selectedAlbum);

  async function getTrackPlayerInfo() {
    const queue = (await TrackPlayer.getQueue()) as RNTrack[];
    const currentTrack = (await TrackPlayer.getActiveTrack()) as RNTrack;
  }

  useEffect(() => {
    const checkTrack = async () => {
      try {
        const queue = await TrackPlayer.getQueue();
        const currentTrack = await TrackPlayer.getActiveTrack();

        const isSameAlbum =
          currentTrack?.trackGroup.urlSlug === trackObject.trackGroup.urlSlug &&
          playableTracks.length === queue?.length;

        if (activeTrack?.url === audioURL && isSameAlbum) {
          setThisSongSelected(true);
        } else {
          setThisSongSelected(false);
        }
      } catch (error) {
        console.error("Error checking track:", error);
      }
    };

    checkTrack();
  }, [activeTrack, playableTracks]);

  const togglePlayBack = async (
    playBackState: PlaybackState | { state: undefined }
  ) => {
    try {
      const queue = await TrackPlayer.getQueue();
      // Set queue if no queue currently set
      if (!queue) {
        console.log("no curr track: setting track");
        await TrackPlayer.setQueue(playableTracks);
        await TrackPlayer.load(trackObject);
        await TrackPlayer.play();
        setActiveTrack(trackObject);
        return;
      }

      const currentTrack = await TrackPlayer.getActiveTrack();

      const isSameAlbum =
        currentTrack?.trackGroup.urlSlug === trackObject.trackGroup.urlSlug &&
        playableTracks.length === queue.length
          ? true
          : false;

      // Song Change to different album
      if (!isSameAlbum) {
        try {
          await TrackPlayer.setQueue(playableTracks);
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
        await TrackPlayer.skip(trackObject.queueIndex);
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
      console.error("issue with playback:", err);
    }
  };

  return (
    <Pressable
      onPress={() => {
        if (canPlayTrack) {
          togglePlayBack(playbackState);
        } else {
          return;
        }
      }}
      style={style}
    >
      <TrackItem
        track={trackObject}
        album={selectedAlbum ? selectedAlbum : undefined}
        thisSongSelected={thisSongSelected}
      ></TrackItem>
    </Pressable>
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
