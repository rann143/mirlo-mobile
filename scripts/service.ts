import TrackPlayer, { Event } from "react-native-track-player";
import { incrementPlayCount } from "./trackPlayUtils";
import { useAuthContext } from "@/state/AuthContext";
import { isTrackOwned } from "./utils";

module.exports = async function () {
  let incremented = false;
  //POTENTIAL BUG: Can service even read from the authContext properly??
  const { user } = useAuthContext();
  let currentTrack: RNTrack | undefined = undefined;

  TrackPlayer.addEventListener(
    Event.RemotePlay,
    async () => await TrackPlayer.play()
  );

  TrackPlayer.addEventListener(
    Event.RemotePause,
    async () => await TrackPlayer.pause()
  );

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      const trackIndex = await TrackPlayer.getActiveTrackIndex();
      const queueLength = queue.length;

      if (trackIndex === queueLength - 1) {
        await TrackPlayer.skip(0);
        await TrackPlayer.play();
      } else {
        await TrackPlayer.skipToNext();
        const cur = await TrackPlayer.getActiveTrack();
        console.log(cur?.title);
        await TrackPlayer.play();
      }
    } catch (err) {
      console.error("issue remoteNext skipping to next song", err);
    }
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();

      if (activeTrackIndex === 0) {
        await TrackPlayer.skip(queue.length - 1);
        await TrackPlayer.play();
      } else {
        await TrackPlayer.skipToPrevious();
        await TrackPlayer.play();
      }
    } catch (err) {
      console.error("issue setting the song to previous track in queue");
    }
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) =>
    TrackPlayer.seekTo(position)
  );

  // CURRENTLY ALL HANDLED IN PLAYERCONTEXT
  // Manages how play counts are incremented for unowned songs
  // We need to keep track to prevent playback of unowned songs once the maximum # of plays has been reached
  // TrackPlayer.addEventListener(
  //   Event.PlaybackProgressUpdated, // SEE DOCS
  //   async ({ position, duration, track }) => {
  //     if (currentTrack === undefined) {
  //       return;
  //     }
  //     // Only increment for unowned songs.
  //     // boolean 'incremented' prevents this condition from running every second after having listened to more the half of the song...
  //     // ...when PlayBackProgress Updated is fired
  //     if (
  //       !isTrackOwned(currentTrack, undefined, user) &&
  //       !incremented &&
  //       position / duration >= 0.5
  //     ) {
  //       incremented = true;
  //       console.log(currentTrack.title + ": " + currentTrack.id);
  //       incrementPlayCount(currentTrack.id);
  //     } else {
  //       console.log("track play count not incremented");
  //     }

  //     // reset boolean 'incremented' if we've already incremented the playcount (meaning more than half the song has been listened to) and
  //     // the current playback position is zero (when the track changes or is replayed). This isn't perfect but will work for now. Room for improvement
  //     if (incremented && position / duration == 0) {
  //       incremented = false;
  //     }
  //   }
  // );

  // TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async () => {
  //   incremented = false;
  //   currentTrack = (await TrackPlayer.getActiveTrack()) as RNTrack;
  // });
};
