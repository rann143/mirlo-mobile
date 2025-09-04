import { incrementPlayCount, reachedMaxPlays } from "@/scripts/trackPlayUtils";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
  const [playableTracks, setPlayableTracks] = useState<RNTrack[]>([]); // Available Tracks to play when opening an album (sets the stage for a potenial queue change)
  const [activeTrack, setActiveTrack] = useState<RNTrack>();
  const [playerState, setPlayerState] = useState<any>(null);
  const playBackState = usePlaybackState();
  const { user } = useAuthContext();
  const router = useRouter();
  const incrementedRef = useRef(false);

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
      Event.PlaybackQueueEnded,
    ],
    async (event) => {
      if (event.type === Event.PlaybackState) {
        setPlayerState(event.state);
        //console.log(event.state);
      }
      if (
        [
          Event.RemoteNext,
          Event.RemotePrevious,
          Event.PlaybackActiveTrackChanged,
        ].includes(event.type)
      ) {
        const track = (await TrackPlayer.getActiveTrack()) as RNTrack;
        setActiveTrack(track);
      }
      if (event.type === Event.PlaybackQueueEnded) {
        await TrackPlayer.skip(0);
      }

      let track = (await TrackPlayer.getActiveTrack()) as RNTrack;

      // PLAY COUNT INCREMENTATION & CHECKING MAX PLAYS should probably be moved to services.ts so they can run when the UI isn't mounted.
      // Check for max plays reached
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

      // Handle track changes - reset increment flag
      if (event.type === Event.PlaybackActiveTrackChanged) {
        incrementedRef.current = false; // Reset for new track
        track = (await TrackPlayer.getActiveTrack()) as RNTrack;
      }

      // Handle playback progress
      if (event.type === Event.PlaybackProgressUpdated) {
        const progressRatio = event.position / event.duration;
        // Reset incremented flag if playback is at the beginning (< 5% to be safe)
        if (progressRatio < 0.05) {
          incrementedRef.current = false;
        }

        // Increment play count once when reaching 50%
        if (
          !isTrackOwned(track, undefined, user) &&
          !incrementedRef.current &&
          progressRatio >= 0.5
        ) {
          incrementedRef.current = true;
          console.log(track.title + ": " + track.id);
          incrementPlayCount(track.id);
        }
        // else {
        //   console.log(
        //     `Track owned: ${isTrackOwned(track, undefined, user)}, ` +
        //       `Already incremented: ${incrementedRef.current}, ` +
        //       `Progress: ${(progressRatio * 100).toFixed(1)}%`
        //   );
        //   console.log("track play count not incremented");
        // }
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
