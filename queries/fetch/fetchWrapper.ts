import { API_ROOT } from "@/constants/api-root";
import { MirloFetchError } from "./MirloFetchError";

async function fetchWrapper<R>(
  endpoint: string,
  init: RequestInit
): Promise<R> {
  const res = await fetch(`${API_ROOT}${endpoint}`, {
    credentials: "include",
    ...init,
  });
  if (!res.ok) {
    let message;
    try {
      message = (await res.json()).error;
    } catch (e) {
      message = res.text;
    }
    throw new MirloFetchError(res, message);
  }
  return await res.json();
}

export function post<T, R>(
  endpoint: string,
  body: T,
  init: RequestInit = {}
): Promise<R> {
  return fetchWrapper(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...init,
  });
}
