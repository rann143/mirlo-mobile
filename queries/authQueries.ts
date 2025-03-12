import {
  QueryFunction,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "./fetch/fetchWrapper";
import { MirloFetchError } from "./fetch/MirloFetchError";
import * as SecureStore from "expo-secure-store";

type LoginBody = {
  email: string;
  password: string;
};

function extractCookieFromHeader(
  setCookieHeader: Array<string>,
  cookieName: string
) {
  if (!setCookieHeader || !Array.isArray(setCookieHeader)) return null;

  for (const cookieString of setCookieHeader) {
    const match = cookieString.match(new RegExp(`^${cookieName}=([^;]+)`));
    if (match) return match[1];
  }
  return null;
}

async function storeTokens(res: Response): Promise<boolean> {
  try {
    //const setCookieHeader = res.headers.getSetCookie();
    const setCookieHeader = res.headers.get("Set-Cookie");
    const cookies = setCookieHeader
      ? setCookieHeader.split(",").map((v) => v.trimStart())
      : [];
    console.log(setCookieHeader);
    const jwtToken = extractCookieFromHeader(cookies, "jwt");
    const refreshToken = extractCookieFromHeader(cookies, "refresh");

    if (jwtToken) {
      let result = await SecureStore.setItemAsync("jwt", jwtToken);
      console.log("heres you jwt: " + result);
    }

    if (refreshToken) {
      let result = await SecureStore.setItemAsync("refresh", refreshToken);
      console.log("heres your refresh: " + result);
    }

    return true;
  } catch (err) {
    console.error("failed to store tokens", err);
    return false;
  }
}

async function login(body: LoginBody) {
  const res: Response = await api.post("/auth/login", body);

  await storeTokens(res);

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
  await api.get("/auth/logout", {});
  // try {
  //   await SecureStore.deleteItemAsync("jwt");
  //   await SecureStore.deleteItemAsync("refresh");
  //   await api.get("/auth/logout", {});
  // } catch (err) {
  //   console.error("issue logging out");
  //   await api.get("/auth/logout", {});
  // }
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
    const res: Response = await api.post("/auth/refresh", {});

    if (res.ok) {
      await SecureStore.deleteItemAsync("jwt");
      await SecureStore.deleteItemAsync("refresh");

      const success = await storeTokens(res);
      return success;
    }

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
