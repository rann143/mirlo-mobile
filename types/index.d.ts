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
