import { useVideoPlayer } from "expo-video";
import { useEvent } from "expo";
import { createContext, useState, useContext } from "react";

interface PlayerContextType {
  player: ReturnType<typeof useVideoPlayer>;
  isPlaying: boolean;
  currentTrackUrl: string;
  setCurrentTrackURL: (url: string) => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export const TrackContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrackUrl, setCurrentTrackURL] = useState<string>("");
  const player = useVideoPlayer(currentTrackUrl);
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const value: PlayerContextType = {
    player,
    isPlaying,
    currentTrackUrl,
    setCurrentTrackURL,
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
