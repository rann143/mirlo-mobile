import {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useAuthRefreshMutation,
  queryAuthProfile,
} from "@/queries/authQueries";

const AuthContext = createContext<{ user?: LoggedInUser | null }>({
  user: undefined,
});

export function AuthContextProvider({ children }: React.PropsWithChildren) {
  const { data: user } = useQuery(queryAuthProfile());
  const userId = user?.id;
  const { authRefresh } = useAuthRefreshMutation();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (userId) {
      interval = setInterval(async () => {
        authRefresh();
      }, 1000 * 60 * 5); //refresh every 5 mintues
    }

    return () => (interval ? clearInterval(interval) : undefined);
  }, [userId, authRefresh]);

  const context = useMemo(() => ({ user }), [user]);

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const { user } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const refreshLoggedInUser = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes("auth"),
    });
  }, [queryClient]);

  return { user, refreshLoggedInUser };
}
