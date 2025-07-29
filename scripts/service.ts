import TrackPlayer, { Event } from "react-native-track-player";

module.exports = async function () {
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
};
