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
import * as api from "../queries/fetch/fetchWrapper";

interface PlayerContextType {
  playbackState: PlaybackState | { state: undefined };
  playableTracks: RNTrack[];
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

  const activeTrackOwnedRef = useRef<boolean>(false);
  const activeTrackIdRef = useRef<number | null>(null);

  useEffect(() => {
    setUpTrackPlayer();
  }, []);

  // Clear cache when user changes (ownership might change with different users)
  useEffect(() => {
    activeTrackOwnedRef.current = false;
    activeTrackIdRef.current = null;
  }, [user]);

  useTrackPlayerEvents(
    [
      Event.RemoteNext,
      Event.RemotePrevious,
      Event.PlaybackActiveTrackChanged,
      Event.PlaybackState,
      Event.PlaybackProgressUpdated,
      Event.PlaybackQueueEnded,
      Event.PlaybackError,
    ],
    async (event) => {
      if (
        event.type === Event.PlaybackError &&
        event.message.includes("Track play limit exceeded")
      ) {
        router.push("/maxPlaysReached");
        return;
      }

      if (event.type === Event.PlaybackState) {
        setPlayerState(event.state);
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

        // Cache ownership status when track changes
        activeTrackOwnedRef.current = isTrackOwned(track);
        console.log(activeTrackOwnedRef);
        activeTrackIdRef.current = track.id;
        incrementedRef.current = false; // Reset for new track
      }
      if (event.type === Event.PlaybackQueueEnded) {
        await TrackPlayer.skip(0);
      }

      // Get current track (only if we haven't already got it above)
      let track: RNTrack;
      if (event.type === Event.PlaybackActiveTrackChanged) {
        track = activeTrack!; // We already have it from above
      } else {
        track = (await TrackPlayer.getActiveTrack()) as RNTrack;
      }

      // Handle playback progress
      if (
        !activeTrackOwnedRef.current &&
        event.type === Event.PlaybackProgressUpdated
      ) {
        const progressRatio = event.position / event.duration;
        // Reset incremented flag if playback is at the beginning (< 5% to be safe)
        if (progressRatio < 0.05) {
          incrementedRef.current = false;
        }

        // Increment play count once when reaching 50%
        if (!incrementedRef.current && progressRatio >= 0.5) {
          incrementedRef.current = true;
          console.log(
            track.title + ": " + (activeTrackIdRef.current || track.id),
          );

          // If there's not a logged-in user, we need to track plays locally. We only want to track plays if we need to -> if maxFreePlays is set.
          // This way we don't take up memory tracking plays for songs that can be played an unlimited number of times without being purchased.
          // We are tracking plays locally to determine if this device has reached maxFreePlays.
          // The api point is used to register the trackPlay in the database.
          if (!user && track.trackGroup.artist.maxFreePlays !== undefined) {
            incrementPlayCount(activeTrackIdRef.current || track.id);
          }
          try {
            const res = await api.get(
              `/v1/tracks/${activeTrackIdRef.current}/trackPlay`,
              {},
            );
            console.log(res);
          } catch (error) {
            console.error("Failed to record track play:", error);
          }
        }
      }

      // Check for max plays reached
      // Run only if user is not logged in since this is all tracked by the api for logged in users.
      // Run only if the track has maxFreePlays set
      // For logged in users, reachedMaxPlays modal will be pushed on playback Error
      if (!user && track.trackGroup.artist.maxFreePlays !== undefined) {
        if (
          (event.type === Event.PlaybackActiveTrackChanged ||
            (event.type === Event.PlaybackProgressUpdated &&
              event.position === 0)) &&
          (await reachedMaxPlays(
            activeTrackIdRef.current || track.id,
            track.trackGroup.artist.maxFreePlays,
          ))
        ) {
          await TrackPlayer.stop();
          router.push("/maxPlaysReached");
          return;
        }
      }
    },
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
        progressUpdateEventInterval: 2, //Every 2 seconds
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
    [playBackState, playableTracks, activeTrack, shuffled, isPlaying, looping],
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
