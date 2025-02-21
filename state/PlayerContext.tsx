import { useVideoPlayer } from "expo-video";
import { useEvent, useEventListener } from "expo";
import { createContext, useState, useContext } from "react";
import { API_ROOT } from "@/constants/api-root";

interface PlayerContextType {
  player: ReturnType<typeof useVideoPlayer>;
  isPlaying: boolean;
  currentSource: TrackProps | null;
  setCurrentSource: (track: TrackProps) => void;
  playerQueue: TrackProps[];
  setPlayerQueue: (tracks: TrackProps[]) => void;
  trackDuration: number;
  currentlyPlayingIndex: number;
  setCurrentlyPlayingIndex: (index: number) => void;
  looping: "loopTrack" | "loopQueue" | "none";
  setLooping: (loopType: "loopTrack" | "loopQueue" | "none") => void;
  shuffled: boolean;
  setShuffled: (shuffle: boolean) => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Keeps track of our player's current 'source' so we can check against it when changing songs
  const [currentSource, setCurrentSource] = useState<TrackProps | null>(null);
  const [playerQueue, setPlayerQueue] = useState<TrackProps[]>([]);
  const [shuffled, setShuffled] = useState<boolean>(false);
  const [looping, setLooping] = useState<"loopTrack" | "loopQueue" | "none">(
    "none"
  );
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState<number>(0);
  const player = useVideoPlayer("", (player) => {
    player.staysActiveInBackground = true;
    player.showNowPlayingNotification = true;
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  const trackDuration = player.duration;

  useEventListener(player, "playToEnd", () => {
    console.log("current track ended");
    onEnd();
  });

  function onEnd() {
    if (looping === "loopQueue") {
      if (currentlyPlayingIndex === playerQueue.length - 1) {
        setCurrentlyPlayingIndex(0);
        setCurrentSource(playerQueue[0]);
        player.replace({
          uri: API_ROOT + playerQueue[0].audio.url,
          metadata: {
            title: playerQueue[0].title,
            artist: playerQueue[0].artist,
            artwork: playerQueue[0].trackGroup.cover?.sizes[60],
          },
        });
        player.play();
        return;
      } else {
        const nextTrackIndex = currentlyPlayingIndex + 1;
        setCurrentSource(playerQueue[nextTrackIndex]);
        setCurrentlyPlayingIndex(nextTrackIndex);
        player.replace({
          uri: API_ROOT + playerQueue[nextTrackIndex].audio.url,
          metadata: {
            title: playerQueue[nextTrackIndex].title,
            artist: playerQueue[nextTrackIndex].artist,
            artwork: playerQueue[nextTrackIndex].trackGroup.cover?.sizes[60],
          },
        });
        player.play();
        return;
      }
    }

    if (looping === "loopTrack") {
      player.loop === true;
      return;
    }

    if (looping === "none") {
      if (currentlyPlayingIndex === playerQueue.length - 1) {
        player.seekBy(-trackDuration);
        return;
      } else {
        const nextTrackIndex = currentlyPlayingIndex + 1;
        setCurrentSource(playerQueue[nextTrackIndex]);
        setCurrentlyPlayingIndex(nextTrackIndex);
        player.replace({
          uri: API_ROOT + playerQueue[nextTrackIndex].audio.url,
          metadata: {
            title: playerQueue[nextTrackIndex].title,
            artist: playerQueue[nextTrackIndex].artist,
            artwork: playerQueue[nextTrackIndex].trackGroup.cover?.sizes[60],
          },
        });
        player.play();
        return;
      }
    }
  }

  const value: PlayerContextType = {
    player,
    isPlaying,
    currentSource,
    setCurrentSource,
    playerQueue,
    setPlayerQueue,
    trackDuration,
    currentlyPlayingIndex,
    setCurrentlyPlayingIndex,
    looping,
    setLooping,
    shuffled,
    setShuffled,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayer must be used within a PlayerContext Provider");
  }

  return context;
};
