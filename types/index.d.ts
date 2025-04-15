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
  about?: string;
  tags?: string[];
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
    urlSlug: string;
  };
  audio: {
    url: string;
    duration: number | undefined;
  };
  isPreview: boolean;
  order: number;
  headers: {};
}

interface PlayButtonProps {
  albumTracks: RNTrack[];
  trackObject: RNTrack;
  buttonColor?: string;
  albumInfo?: AlbumProps;
}

interface Artist {
  name: string;
  bio: string;
  activityPub: boolean;
  urlSlug?: string;
  userId: number;
  id: number;
  location?: string;
  enabled: boolean;
  createdAt: string;
  artistLabels?: ArtistLabel[];
  trackGroups: TrackGroup[];
  links?: string[];
  linksJson?: Link[];
  properties?: {
    colors: ArtistColors;
  };
  user?: Partial<User>;
  banner?: {
    url: string;
    sizes?: { [key: number]: string };
    updatedAt: string;
  };
  avatar?: {
    url: string;
    sizes?: { [key: string]: string };
    updatedAt: string;
  };
}
