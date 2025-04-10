export const isTrackOwnedOrPreview = (
  track: RNTrack,
  user?: LoggedInUser | null,
  trackGroup?: AlbumProps
): boolean => {
  if (track.isPreview) {
    return true;
  }
  if (
    trackGroup?.releaseDate &&
    new Date(trackGroup.releaseDate) > new Date()
  ) {
    return false;
  }
  if (!user) {
    return false;
  }
  const lookInTrackGroup = trackGroup ?? track.trackGroup;
  const ownsTrack = lookInTrackGroup.artistId === user.id;
  const boughtTrack = !!lookInTrackGroup.userTrackGroupPurchases?.find(
    (utgp) => utgp.userId === user.id
  );
  return ownsTrack || boughtTrack;
};
