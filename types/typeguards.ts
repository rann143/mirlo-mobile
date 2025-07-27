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

export function isFavoritedTrack(
  entity: unknown
): entity is { userId: number; trackId: number; track: RNTrack } {
  if (!entity) {
    return false;
  }

  return (
    (entity as { userId: number; trackId: number; track: RNTrack }).trackId !==
    undefined
  );
}

export function isWishlisted(entity: unknown): entity is {
  userId: number;
  trackGroupId: number;
  trackGroup: AlbumProps;
  createdAt: Date;
} {
  if (!entity) {
    return false;
  }

  return (
    (
      entity as {
        userId: number;
        trackGroupId: number;
        trackGroup: AlbumProps;
        createdAt: Date;
      }
    ).trackGroupId !== undefined
  );
}
