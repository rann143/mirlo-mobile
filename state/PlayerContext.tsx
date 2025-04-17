import { createContext, useState, useContext, useEffect } from "react";
import TrackPlayer, {
  Capability,
  Event,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  PlaybackState,
  Progress,
  Track,
} from "react-native-track-player";

interface PlayerContextType {
  playbackState: PlaybackState | { state: undefined };
  progress: Progress;
  playableTracks: Array<RNTrack>;
  setPlayableTracks: (tracks: RNTrack[]) => void;
  activeTrack: Track | undefined;
  setActiveTrack: (track: RNTrack) => void;
  shuffled: boolean;
  setShuffled: (shuffled: boolean) => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shuffled, setShuffled] = useState<boolean>(false);
  const [playableTracks, setPlayableTracks] = useState<RNTrack[]>([]);
  const [activeTrack, setActiveTrack] = useState<RNTrack>();

  const playBackState = usePlaybackState();
  const progress = useProgress();

  useEffect(() => {
    setUpTrackPlayer();
  }, []);

  useEffect(() => {
    setShuffled(false);
  }, [playableTracks]);

  useTrackPlayerEvents(
    [Event.RemoteNext, Event.RemotePrevious, Event.PlaybackActiveTrackChanged],
    async (event) => {
      const track = (await TrackPlayer.getActiveTrack()) as RNTrack;
      setActiveTrack(track);
    }
  );

  async function setUpTrackPlayer() {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
      });
      console.log("track player set up");
    } catch (err) {
      console.error("Issue setting up Track Player", err);
    }
  }

  const value: PlayerContextType = {
    playbackState: playBackState,
    progress: progress,
    playableTracks: playableTracks,
    setPlayableTracks: setPlayableTracks,
    activeTrack: activeTrack,
    setActiveTrack: setActiveTrack,
    shuffled: shuffled,
    setShuffled: setShuffled,
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
