export const createMockUser = (
  overrides?: Partial<LoggedInUser>
): LoggedInUser => ({
  email: "test@example.com",
  name: "Test User",
  id: 1,
  isAdmin: false,
  userTrackGroupPurchases: [],
  currency: "USD",
  wishlist: [],
  language: "en",
  ...overrides,
});
