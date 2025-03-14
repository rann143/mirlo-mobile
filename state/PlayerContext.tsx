import { useVideoPlayer } from "expo-video";
import { useEvent, useEventListener } from "expo";
import { createContext, useState, useContext, useEffect } from "react";
import { API_ROOT } from "@/constants/api-root";
import * as Notifications from "expo-notifications";
import TrackPlayer, {
  Capability,
  State,
  Event,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  PlaybackState,
  Progress,
  Track,
} from "react-native-track-player";
import { setupPlayer } from "react-native-track-player/lib/src/trackPlayer";

interface PlayerContextType {
  playbackState: PlaybackState | { state: undefined };
  progress: Progress;
  album: Array<RNTrack>;
  setAlbum: (tracks: RNTrack[]) => void;
  activeTrack: Track | undefined;
  setActiveTrack: (track: RNTrack) => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Keeps track of our player's current 'source' so we can check against it when changing songs
  // const [currentSource, setCurrentSource] = useState<TrackProps | null>(null);
  // const [playerQueue, setPlayerQueue] = useState<TrackProps[]>([]);
  // const [shuffled, setShuffled] = useState<boolean>(false);
  // const [looping, setLooping] = useState<"loopTrack" | "loopQueue" | "none">(
  //   "none"
  // );
  // const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState<number>(0);
  const [album, setAlbum] = useState<RNTrack[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [trackTitle, setTrackTitle] = useState<string>();
  const [trackArtist, setTrackArtist] = useState<string>();
  const [trackArtwork, setTrackArtwork] = useState<string>();
  const [activeTrack, setActiveTrack] = useState<RNTrack>();

  const playBackState = usePlaybackState();
  const progress = useProgress();

  // **************************************

  useEffect(() => {
    setUpTrackPlayer();
  }, []);

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    if (typeof event.index !== "number") return;

    const queue = await TrackPlayer.getQueue();

    const currentIndex = event.index;
    const track = await TrackPlayer.getTrack(currentIndex);
    if (track == undefined) return;
    const { title, artwork, artist } = track;
    setTrackIndex(currentIndex);
    setTrackTitle(title);
    setTrackArtist(artist);
    setTrackArtwork(artwork);
  });

  async function setUpTrackPlayer() {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });
      console.log("track player set up");
    } catch (err) {
      console.error("Issue setting up Track Player", err);
    }
  }

  // **************************************

  const value: PlayerContextType = {
    playbackState: playBackState,
    progress: progress,
    album: album,
    setAlbum: setAlbum,
    activeTrack: activeTrack,
    setActiveTrack: setActiveTrack,
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
