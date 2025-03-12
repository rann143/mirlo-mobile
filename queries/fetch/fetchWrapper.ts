import { API_ROOT } from "@/constants/api-root";
import { MirloFetchError } from "./MirloFetchError";
import * as SecureStorage from "expo-secure-store";
import { head } from "lodash";

/**
 * Wraps fetch() calls to Mirlo's API with error handling.
 *
 * @param endpoint The API request path (appended to API_ROOT)
 * @param init Fetch request options
 * @returns The resolved JSON response
 * @throws MirloFetchError if the response code is not OK
 * @throws SyntaxError if the response body is not JSON
 */
async function fetchWrapper<R>(
  endpoint: string,
  init: RequestInit
): Promise<R> {
  const jwtToken = await SecureStorage.getItemAsync("jwt");
  console.log("token: " + jwtToken);
  const refreshToken = await SecureStorage.getItemAsync("refresh");
  console.log("refresh: " + refreshToken);

  let cookieHeader = "";
  if (jwtToken) cookieHeader += `jwt=${jwtToken}; `;
  if (refreshToken) cookieHeader += `refresh=${refreshToken}`;

  const headers = new Headers(init.headers);

  if (cookieHeader) {
    headers.append("Cookie", cookieHeader);
  }

  const res = await fetch(`${API_ROOT}${endpoint}`, {
    //credentials: "include",
    ...init,
    headers,
  });
  console.log(headers);
  console.log(res);

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

/**
 * Wraps fetch() POST calls to Mirlo's API with error handling.
 *
 * @param endpoint The API request path (appended to API_ROOT)
 * @param body The JSON-encoded request body
 * @param init Fetch request options
 * @returns The resolved JSON response
 * @throws MirloFetchError if the response code is not OK
 * @throws SyntaxError if the response body is not JSON
 */
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

/**
 * Wraps fetch() GET calls to Mirlo's API with error handling.
 *
 * @param endpoint The API request path (appended to API_ROOT)
 * @param init Fetch request options
 * @returns The resolved JSON response
 * @throws MirloFetchError if the response code is not OK
 * @throws SyntaxError if the response body is not JSON
 */
export function get<R>(endpoint: string, init: RequestInit): Promise<R> {
  return fetchWrapper(endpoint, {
    method: "GET",
    ...init,
  });
}
