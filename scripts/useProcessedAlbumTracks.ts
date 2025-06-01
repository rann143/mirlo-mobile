// hooks/useProcessedAlbumTracks.ts
import { useMemo } from "react";
import { isEqual } from "lodash";
import { isTrackOwnedOrPreview } from "@/scripts/utils";
import { API_KEY } from "@/constants/api-key";
import { API_ROOT } from "@/constants/api-root";
import { useAuthContext } from "@/state/AuthContext";

export function useProcessedAlbumTracks(
  data: { result: AlbumProps } | undefined
) {
  const { user } = useAuthContext();

  return useMemo(() => {
    if (!data || !data.result.tracks)
      return { allTracks: [], playableTracks: [] };

    const allTracks: RNTrack[] = [];
    const playableTracks: RNTrack[] = [];
    let playableIndex = 0;

    for (const track of data.result.tracks) {
      const newTrack: RNTrack = {
        title: track.title,
        artist: data.result.artist.name,
        artwork: data.result.cover.sizes[600],
        url: `${API_ROOT}${track.audio.url}`,
        id: data.result.id,
        trackArtists: track.trackArtists,
        queueIndex: track.order,
        trackGroupId: data.result.trackGroupId,
        trackGroup: {
          userTrackGroupPurchases: data.result.userTrackGroupPurchases,
          artistId: data.result.artistId,
          urlSlug: data.result.urlSlug,
          cover: data.result.cover,
          title: data.result.title,
          artist: data.result.artist,
        },
        audio: {
          url: track.audio.url,
          duration: track.audio.duration,
        },
        isPreview: track.isPreview,
        order: track.order,
        headers: {
          "mirlo-api-key": API_KEY,
        },
      };

      allTracks.push(newTrack);

      if (isTrackOwnedOrPreview(newTrack, user, data.result)) {
        newTrack.queueIndex = playableIndex;
        playableIndex++;
        playableTracks.push(newTrack);
      }
    }

    return { allTracks, playableTracks };
  }, [data, user]);
}
