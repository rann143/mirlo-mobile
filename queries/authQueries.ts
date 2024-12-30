import {
  QueryFunction,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "./fetch/fetchWrapper";

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
