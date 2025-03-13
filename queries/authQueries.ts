import {
  QueryFunction,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "./fetch/fetchWrapper";
import { MirloFetchError } from "./fetch/MirloFetchError";
import CookieManager from "@react-native-cookies/cookies";
import * as SecureStore from "expo-secure-store";
import { API_ROOT } from "@/constants/api-root";

type LoginBody = {
  email: string;
  password: string;
};

async function storeTokens(): Promise<boolean> {
  try {
    const cookies = await CookieManager.getAll();

    const jwtToken = cookies.jwt.value;
    const refreshToken = cookies.refresh.value;

    await SecureStore.setItemAsync("jwt", jwtToken);
    await SecureStore.setItemAsync("refresh", refreshToken);

    return true;
  } catch (err) {
    console.error("failed to store tokens", err);
    return false;
  }
}

async function login(body: LoginBody) {
  const res: Response = await api.post("/auth/login", body);

  await storeTokens();

  return res;
}

export function useLoginMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: login,
    async onSuccess() {
      await client.invalidateQueries({
        predicate: (query) => query.queryKey.includes("auth"),
      });
    },
  });
}

async function logout() {
  // Clear stored tokens regardless of response

  try {
    await api.get("/auth/logout", {});
    await CookieManager.clearAll();
    await SecureStore.deleteItemAsync("jwt");
    await SecureStore.deleteItemAsync("refresh");
  } catch (err) {
    console.error("issue logging out");
  }
}

export function useLogoutMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: logout,
    async onSuccess() {
      await client.invalidateQueries({
        predicate: (query) => query.queryKey.includes("auth"),
      });
    },
  });
}

export async function authRefresh() {
  try {
    await CookieManager.clearAll();
    const res: Response = await api.post("/auth/refresh", {});
    await SecureStore.deleteItemAsync("jwt");
    await SecureStore.deleteItemAsync("refresh");
    await storeTokens();

    return false;
  } catch (err) {
    console.error("Token refresh failed", err);
    return false;
  }
}

export function useAuthRefreshMutation() {
  const client = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: authRefresh,
    async onSuccess() {
      await client.invalidateQueries({
        predicate: (query) => query.queryKey.includes("auth"),
      });
    },
  });

  return { authRefresh: mutate };
}

const fetchProfile: QueryFunction<
  LoggedInUser | null,
  ["fetchProfile", ...string[]]
> = ({ signal }) => {
  return api
    .get<{ result: LoggedInUser }>(`/auth/profile`, { signal })
    .then((r) => r.result)
    .catch((e) => {
      if (e instanceof MirloFetchError && e.status === 401) return null;
      else throw e;
    });
};

export function queryAuthProfile() {
  return queryOptions({
    queryKey: ["fetchProfile", "auth"],
    queryFn: fetchProfile,
  });
}
