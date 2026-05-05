import * as api from "@/queries/fetch/fetchWrapper";
import { MirloFetchError } from "@/queries/fetch/MirloFetchError";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("@/constants/api-root", () => ({ API_ROOT: "https://test.api" }));
jest.mock("@/constants/api-key", () => ({ API_KEY: "test-api-key" }));

import * as SecureStore from "expo-secure-store";

const mockedGetItem = SecureStore.getItemAsync as jest.MockedFunction<
  typeof SecureStore.getItemAsync
>;

const okJson = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });

const errorJson = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("fetchWrapper.get", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetItem.mockResolvedValue(null);
    global.fetch = jest.fn();
  });

  test("appends API_ROOT and forwards mirlo-api-key header", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(okJson({ ok: true }));

    await api.get("/v1/foo", {});

    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://test.api/v1/foo");
    const headers = init.headers as Headers;
    expect(headers.get("mirlo-api-key")).toBe("test-api-key");
  });

  test("attaches Cookie header when jwt + refresh tokens are stored", async () => {
    mockedGetItem
      .mockResolvedValueOnce("jwt-token-value")
      .mockResolvedValueOnce("refresh-token-value");
    (global.fetch as jest.Mock).mockResolvedValueOnce(okJson({ ok: true }));

    await api.get("/v1/foo", {});

    const init = (global.fetch as jest.Mock).mock.calls[0][1];
    const headers = init.headers as Headers;
    expect(headers.get("Cookie")).toBe(
      "jwt=jwt-token-value; refresh=refresh-token-value",
    );
  });

  test("omits Cookie header when no tokens are stored", async () => {
    mockedGetItem.mockResolvedValue(null);
    (global.fetch as jest.Mock).mockResolvedValueOnce(okJson({ ok: true }));

    await api.get("/v1/foo", {});

    const headers = (global.fetch as jest.Mock).mock.calls[0][1]
      .headers as Headers;
    expect(headers.has("Cookie")).toBe(false);
  });

  test("returns parsed JSON on success", async () => {
    mockedGetItem.mockResolvedValue(null);
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      okJson({ result: { id: 1, title: "song" } }),
    );

    const data = await api.get<{ result: { id: number; title: string } }>(
      "/v1/tracks/1",
      {},
    );

    expect(data.result).toEqual({ id: 1, title: "song" });
  });

  test("falls back to raw text when response is not JSON", async () => {
    mockedGetItem.mockResolvedValue(null);
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("plaintext body", { status: 200 }),
    );

    const data = await api.get<string>("/v1/text", {});
    expect(data).toBe("plaintext body");
  });

  test("throws MirloFetchError on non-2xx response with the API's error message", async () => {
    mockedGetItem.mockResolvedValue(null);
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      errorJson(401, { error: "Invalid jwt" }),
    );

    expect.assertions(3);
    try {
      await api.get("/v1/auth/profile", {});
    } catch (e) {
      expect(e).toBeInstanceOf(MirloFetchError);
      expect((e as MirloFetchError).status).toBe(401);
      expect((e as Error).message).toBe("Invalid jwt");
    }
  });

  test("throws MirloFetchError with raw text when error body is not JSON", async () => {
    mockedGetItem.mockResolvedValue(null);
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("Service Unavailable", { status: 503 }),
    );

    try {
      await api.get("/v1/x", {});
      fail("expected throw");
    } catch (e) {
      expect(e).toBeInstanceOf(MirloFetchError);
      expect((e as MirloFetchError).status).toBe(503);
      expect((e as Error).message).toBe("Service Unavailable");
    }
  });
});

describe("fetchWrapper.post", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetItem.mockResolvedValue(null);
    global.fetch = jest.fn();
  });

  test("sets POST + JSON content-type + serialized body", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(okJson({ ok: true }));

    await api.post("/auth/login", { email: "a@b.c", password: "x" });

    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(
      JSON.stringify({ email: "a@b.c", password: "x" }),
    );
    const headers = init.headers as Headers;
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(headers.get("Accept")).toBe("application/json");
  });
});

describe("fetchWrapper.del", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetItem.mockResolvedValue(null);
    global.fetch = jest.fn();
  });

  test("sets method DELETE and forwards auth headers", async () => {
    mockedGetItem
      .mockResolvedValueOnce("jwt-token-value")
      .mockResolvedValueOnce("refresh-token-value");
    (global.fetch as jest.Mock).mockResolvedValueOnce(okJson({ ok: true }));

    await api.del("/v1/users/4");

    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://test.api/v1/users/4");
    expect(init.method).toBe("DELETE");
    const headers = init.headers as Headers;
    expect(headers.get("mirlo-api-key")).toBe("test-api-key");
    expect(headers.get("Cookie")).toContain("jwt=jwt-token-value");
  });

  test("propagates 401 as MirloFetchError", async () => {
    mockedGetItem.mockResolvedValue(null);
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      errorJson(401, { error: "Unauthenticated" }),
    );

    try {
      await api.del("/v1/users/4");
      fail("expected throw");
    } catch (e) {
      expect(e).toBeInstanceOf(MirloFetchError);
      expect((e as MirloFetchError).status).toBe(401);
    }
  });
});
