interface LoggedInUser {
  email: string;
  name: string;
  id: number;
  userTrackGroupPurchases?: { trackGroupId: number }[];
  isAdmin: boolean;
  currency?: string;
  wishlist?: {
    userId: number;
    trackGroupId: number;
  }[];
  language?: string;
}

interface UserTrackGroupPurchase {
  userId: number;
  user?: User;
  trackGroupId: number;
  trackGroup?: TrackGroup;
  pricePaid: number;
  currencyPaid: string;
  datePurchased: string;
  singleDownloadToken?: string;
}

interface AlbumProps {
  id: number;
  cover: {
    sizes: {
      60: string;
      120: string;
      300: string;
      600: string;
      960: string;
      1200: string;
      1500: string;
    };
  };
  title: string;
  artist: {
    name: string;
    id: number;
  };
  artistId: number;
  urlSlug: string;
  userTrackGroupPurchases?: { userId: number }[];
  releaseDate: string;
  tracks?: RNTrack[];
}

interface TrackProps {
  title: string;
  order: number;
  id: number | undefined;
  artist: string;
  albumId: number;
  trackGroup: AlbumProps;
  isPreview: boolean;
  audio: {
    url: string;
    duration: number | undefined;
  };
}

interface RNTrack {
  title: string;
  artist: string;
  artwork: string;
  url: string;
  trackGroup: {
    userTrackGroupPurchases?: { userId: number }[];
    artistId: number;
  };
  audio: {
    url: string;
    duration: number | undefined;
  };
  isPreview: boolean;
  order: number;
}
