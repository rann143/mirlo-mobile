import { createContext, useState, useContext } from "react";

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

const AuthContext = createContext<{ user?: LoggedInUser | null }>({
  user: undefined,
});

// export function AuthContextProvider({ children }: React.PropsWithChildren) {
//     const {data: user} =
// }
