type TrackGroupPurchaseWithTrackGroup = UserTrackGroupPurchase & {
  trackGroup: AlbumProps;
};

type TrackPurchaseWithTrack = UserTrackPurchase & {
  track: RNTrack;
};

export function isTrackPurchase(entity: unknown): entity is UserTrackPurchase {
  if (!entity) {
    return false;
  }
  return (entity as UserTrackPurchase).trackId !== undefined;
}

export function isTrackGroupPurchase(
  entity: unknown
): entity is UserTrackGroupPurchase {
  if (!entity) {
    return false;
  }
  return (entity as UserTrackGroupPurchase).trackGroupId !== undefined;
}
