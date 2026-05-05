// Default each mocked async function to a resolved Promise — the source
// code chains .catch() on the return values, which would otherwise
// throw "Cannot read properties of undefined (reading 'catch')"
jest.mock("@preeternal/react-native-cookie-manager", () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({}),
    getAll: jest.fn().mockResolvedValue({}),
    clearAll: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/constants/api-root", () => ({ API_ROOT: "https://test.api" }));
jest.mock("@/constants/api-key", () => ({ API_KEY: "test-key" }));

import {
  storeTokens,
  clearLocalAuthSession,
} from "@/queries/authQueries";
import CookieManager from "@preeternal/react-native-cookie-manager";
import * as SecureStore from "expo-secure-store";

const cm = CookieManager as unknown as {
  get: jest.Mock;
  clearAll: jest.Mock;
};

const setItem = SecureStore.setItemAsync as jest.MockedFunction<
  typeof SecureStore.setItemAsync
>;
const deleteItem = SecureStore.deleteItemAsync as jest.MockedFunction<
  typeof SecureStore.deleteItemAsync
>;

describe("storeTokens", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("reads cookies for the API origin (not getAll)", async () => {
    cm.get.mockResolvedValueOnce({
      jwt: { value: "jwt-v" },
      refresh: { value: "refresh-v" },
    });

    await storeTokens();

    expect(cm.get).toHaveBeenCalledWith("https://test.api");
  });

  test("stores both jwt and refresh into secure store and resolves true", async () => {
    cm.get.mockResolvedValueOnce({
      jwt: { value: "jwt-v" },
      refresh: { value: "refresh-v" },
    });

    const ok = await storeTokens();

    expect(ok).toBe(true);
    expect(setItem).toHaveBeenCalledWith("jwt", "jwt-v");
    expect(setItem).toHaveBeenCalledWith("refresh", "refresh-v");
  });

  test("returns false and skips writes when jwt cookie is missing", async () => {
    cm.get.mockResolvedValueOnce({
      refresh: { value: "refresh-only" },
    });

    const ok = await storeTokens();

    expect(ok).toBe(false);
    expect(setItem).not.toHaveBeenCalled();
  });

  test("returns false and skips writes when refresh cookie is missing", async () => {
    cm.get.mockResolvedValueOnce({
      jwt: { value: "jwt-only" },
    });

    const ok = await storeTokens();

    expect(ok).toBe(false);
    expect(setItem).not.toHaveBeenCalled();
  });

  test("returns false (not throws) when CookieManager.get rejects", async () => {
    cm.get.mockRejectedValueOnce(new Error("native module unavailable"));

    const ok = await storeTokens();

    expect(ok).toBe(false);
  });
});

describe("clearLocalAuthSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("clears cookies (both webview stores) and removes both stored tokens", async () => {
    cm.clearAll.mockResolvedValue(true);

    await clearLocalAuthSession();

    // both passes are called: false (default cookie store) + true (WebKit
    // cookie store on iOS)
    expect(cm.clearAll).toHaveBeenCalledTimes(2);
    expect(cm.clearAll).toHaveBeenNthCalledWith(1);
    expect(cm.clearAll).toHaveBeenNthCalledWith(2, true);

    expect(deleteItem).toHaveBeenCalledWith("jwt");
    expect(deleteItem).toHaveBeenCalledWith("refresh");
  });

  test("swallows clearAll rejection so a partial failure doesn't break logout", async () => {
    cm.clearAll.mockRejectedValue(new Error("oops"));

    await expect(clearLocalAuthSession()).resolves.toBeUndefined();

    expect(deleteItem).toHaveBeenCalledWith("jwt");
    expect(deleteItem).toHaveBeenCalledWith("refresh");
  });

  test("swallows secure-store rejection so a partial failure doesn't break logout", async () => {
    cm.clearAll.mockResolvedValue(true);
    deleteItem.mockRejectedValue(new Error("ks unavailable"));

    await expect(clearLocalAuthSession()).resolves.toBeUndefined();
  });
});
