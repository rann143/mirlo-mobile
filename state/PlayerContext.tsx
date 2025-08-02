import { reachedMaxPlays } from "@/scripts/trackPlayUtils";
import { createContext, useState, useContext, useEffect, useMemo } from "react";
import TrackPlayer, {
  Capability,
  Event,
  usePlaybackState,
  useTrackPlayerEvents,
  PlaybackState,
  State,
} from "react-native-track-player";
import { useAuthContext } from "./AuthContext";
import { isTrackOwned } from "@/scripts/utils";
import { useRouter } from "expo-router";

interface PlayerContextType {
  playbackState: PlaybackState | { state: undefined };
  playableTracks: Array<RNTrack>;
  setPlayableTracks: (tracks: RNTrack[]) => void;
  activeTrack: RNTrack | undefined;
  setActiveTrack: (track: RNTrack) => void;
  shuffled: boolean;
  setShuffled: (shuffled: boolean) => void;
  isPlaying: boolean;
  looping: "none" | "track" | "queue";
  setLooping: (looping: "none" | "track" | "queue") => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shuffled, setShuffled] = useState<boolean>(false);
  const [looping, setLooping] = useState<"none" | "track" | "queue">("none");
  const [playableTracks, setPlayableTracks] = useState<RNTrack[]>([]);
  const [activeTrack, setActiveTrack] = useState<RNTrack>();
  const [playerState, setPlayerState] = useState<any>(null);
  const playBackState = usePlaybackState();
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    setUpTrackPlayer();
  }, []);

  useTrackPlayerEvents(
    [
      Event.RemoteNext,
      Event.RemotePrevious,
      Event.PlaybackActiveTrackChanged,
      Event.PlaybackState,
      Event.PlaybackProgressUpdated,
    ],
    async (event) => {
      if (event.type === Event.PlaybackState) {
        setPlayerState(event.state);
      }

      if (event.type !== Event.PlaybackState) {
        const track = (await TrackPlayer.getActiveTrack()) as RNTrack;
        setActiveTrack(track);
      }

      const track = (await TrackPlayer.getActiveTrack()) as RNTrack;

      // This check runs if either the active track changes or playback progress == 0, the track is NOT owned, and reachMaxPlays === true
      // Should this be in PlayerContext? Or in service.ts with the Increment play count functionality? I'm thinking they should probably be together.
      // Need to work out pros & cons of where it makes most sense. This works for now.
      if (
        (event.type === Event.PlaybackActiveTrackChanged ||
          (event.type == Event.PlaybackProgressUpdated &&
            event.position === 0)) &&
        !isTrackOwned(track, undefined, user) &&
        (await reachedMaxPlays(track.id))
      ) {
        await TrackPlayer.stop();
        router.push("/maxPlaysReached");
        console.log("You've reached max plays. Plz purchase. Show some love");
      }
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
        progressUpdateEventInterval: 1,
      });
      console.log("track player set up");
    } catch (err) {
      console.error("Issue setting up Track Player", err);
    }
  }

  const isPlaying = playerState === State.Playing;

  const value: PlayerContextType = useMemo(
    () => ({
      playbackState: playBackState,
      playableTracks: playableTracks, // This was already memoized indirectly by the array reference, but explicit useMemo is fine
      setPlayableTracks: setPlayableTracks,
      activeTrack: activeTrack,
      setActiveTrack: setActiveTrack,
      shuffled: shuffled,
      setShuffled: setShuffled,
      isPlaying: isPlaying,
      looping: looping,
      setLooping: setLooping,
    }),
    [playBackState, playableTracks, activeTrack, shuffled, isPlaying, looping]
  );
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
