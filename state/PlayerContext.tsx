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
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Keeps track of our player's current 'source' so we can check against it when changing songs
  const [currentSource, setCurrentSource] = useState<TrackProps | null>(null);
  const [playerQueue, setPlayerQueue] = useState<TrackProps[]>([]);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState<number>(0);
  const player = useVideoPlayer("", (player) => {
    player.play();
    player.staysActiveInBackground = true;
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  const trackDuration = player.duration;

  useEventListener(player, "playToEnd", () => {
    console.log("current track ended");
    if (currentlyPlayingIndex === playerQueue.length - 1) {
      setCurrentlyPlayingIndex(0);
      setCurrentSource(playerQueue[0]);
      player.replace(API_ROOT + playerQueue[0].audio.url);
      player.play();
    } else {
      const nextTrackIndex = currentlyPlayingIndex + 1;
      setCurrentSource(playerQueue[nextTrackIndex]);
      setCurrentlyPlayingIndex(nextTrackIndex);
      player.replace(API_ROOT + playerQueue[nextTrackIndex].audio.url);
      player.play();
    }
  });

  //const hadEnded = player.currentTime === player.duration ? true : false;

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
