import { useVideoPlayer } from "expo-video";
import { useEvent } from "expo";
import { createContext, useState, useContext } from "react";

interface PlayerContextType {
  player: ReturnType<typeof useVideoPlayer>;
  isPlaying: boolean;
  currentSource: TrackProps | null;
  setCurrentSource: (track: TrackProps) => void;
  playerQueue: TrackProps[];
  setPlayerQueue: (tracks: TrackProps[]) => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Keeps track of our player's current 'source' so we can check against it when changing songs
  const [currentSource, setCurrentSource] = useState<TrackProps | null>(null);
  const [playerQueue, setPlayerQueue] = useState<TrackProps[]>([]);
  const player = useVideoPlayer("", (player) => {
    player.play();
    player.staysActiveInBackground = true;
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const value: PlayerContextType = {
    player,
    isPlaying,
    currentSource,
    setCurrentSource,
    playerQueue,
    setPlayerQueue,
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
