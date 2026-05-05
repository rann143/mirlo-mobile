export const createMockUser = (
  overrides?: Partial<LoggedInUser>,
): LoggedInUser => ({
  email: "test@example.com",
  name: "Test User",
  id: 1,
  isAdmin: false,
  userTrackGroupPurchases: [],
  userTrackPurchases: [],
  artists: [],
  artistUserSubscriptions: [],
  merchPurchase: [],
  currency: "USD",
  wishlist: [],
  language: "en",
  ...overrides,
});
