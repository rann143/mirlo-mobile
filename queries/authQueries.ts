import {
  QueryFunction,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "./fetch/fetchWrapper";
import { MirloFetchError } from "./fetch/MirloFetchError";

type LoginBody = {
  email: string;
  password: string;
};

async function login(body: LoginBody) {
  await api.post("/auth/login", body);
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
  await api.get("/auth/logout", {});
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
  await api.post("/auth/refresh", {});
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
