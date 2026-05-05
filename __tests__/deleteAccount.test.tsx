/* eslint-disable @typescript-eslint/no-require-imports */
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

import { createMockUser } from "@/__mocks__/mockUser";

const mockDismiss = jest.fn();
const mockDel = jest.fn();
const mockClearSession = jest.fn();
const mockSetQueryData = jest.fn();
const mockRefreshLoggedInUser = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ dismiss: mockDismiss, dismissTo: mockDismiss }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ setQueryData: mockSetQueryData }),
}));

jest.mock("@/queries/fetch/fetchWrapper", () => ({
  del: (...args: unknown[]) => mockDel(...args),
}));

let mockCurrentUser: ReturnType<typeof createMockUser> | null = createMockUser();
jest.mock("@/state/AuthContext", () => ({
  useAuthContext: () => ({
    user: mockCurrentUser,
    refreshLoggedInUser: mockRefreshLoggedInUser,
  }),
}));

jest.mock("@/queries/authQueries", () => ({
  AUTH_PROFILE_QUERY_KEY: ["fetchProfile", "auth"],
  clearLocalAuthSession: (...args: unknown[]) => mockClearSession(...args),
}));

jest.mock("@/components/DismissModalBar", () => {
  const { View } = require("react-native");
  return { __esModule: true, default: () => <View testID="dismiss-modal-bar" /> };
});

const importScreen = () => require("@/app/deleteAccount").default;

describe("<DeleteAccountScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentUser = createMockUser();
    mockDel.mockResolvedValue({});
    mockClearSession.mockResolvedValue(undefined);
  });

  test("renders the title and warning bullets", () => {
    const Screen = importScreen();
    const { getByText, getAllByText } = render(<Screen />);

    // "Delete account" appears as both title and button label
    expect(getAllByText("Delete account").length).toBeGreaterThanOrEqual(2);
    expect(
      getByText(/permanently deletes your Mirlo account/i),
    ).toBeTruthy();
    expect(getByText("This action cannot be undone.")).toBeTruthy();
  });

  test("hides the account summary card entirely when all counts are zero", () => {
    mockCurrentUser = createMockUser({
      artists: [],
      artistUserSubscriptions: [],
      userTrackGroupPurchases: [],
      userTrackPurchases: [],
      merchPurchase: [],
    });
    const Screen = importScreen();
    const { queryByText } = render(<Screen />);

    expect(queryByText("Account summary")).toBeNull();
    expect(queryByText(/Artist profiles:/)).toBeNull();
    expect(queryByText(/Music purchases:/)).toBeNull();
  });

  test("shows only nonzero rows in the summary card", () => {
    mockCurrentUser = createMockUser({
      // 1 artist profile, 0 subs, 2 album purchases + 1 track purchase = 3
      // music purchases, 0 merch
      artists: [{ id: 1 } as unknown as Artist],
      artistUserSubscriptions: [],
      userTrackGroupPurchases: [
        { trackGroupId: 10 },
        { trackGroupId: 11 },
      ],
      userTrackPurchases: [{ trackId: 100 }],
      merchPurchase: [],
    });
    const Screen = importScreen();
    const { getByText, queryByText } = render(<Screen />);

    expect(getByText("Account summary")).toBeTruthy();
    expect(getByText("Artist profiles: 1")).toBeTruthy();
    expect(getByText("Music purchases: 3")).toBeTruthy();
    expect(queryByText(/Artist subscriptions:/)).toBeNull();
    expect(queryByText(/Merch purchases:/)).toBeNull();
  });

  test("pressing Delete account opens a confirmation Alert", () => {
    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation(() => undefined);

    const Screen = importScreen();
    const { getAllByText } = render(<Screen />);

    // getAllByText returns [title, button-label]; press the button
    const matches = getAllByText("Delete account");
    fireEvent.press(matches[matches.length - 1]);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    const [title, message, buttons] = alertSpy.mock.calls[0];
    expect(title).toBe("Delete account?");
    expect(message).toMatch(/permanently deletes your Mirlo account/i);
    // Cancel button + destructive Delete button
    expect(buttons).toHaveLength(2);
    expect(buttons![0].text).toBe("Cancel");
    expect(buttons![1].text).toBe("Delete account");
    expect(buttons![1].style).toBe("destructive");

    alertSpy.mockRestore();
  });

  test("confirming the Alert fires DELETE /v1/users/{id}, clears session, dismisses", async () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    mockCurrentUser = createMockUser({ id: 4242 });

    const Screen = importScreen();
    const { getAllByText } = render(<Screen />);

    const matches = getAllByText("Delete account");
    fireEvent.press(matches[matches.length - 1]);

    // Simulate the user tapping the destructive Delete in the native Alert
    const buttons = alertSpy.mock.calls[0][2];
    const destructive = buttons!.find((b) => b.style === "destructive");
    expect(destructive).toBeDefined();
    destructive!.onPress?.();

    await waitFor(() => {
      expect(mockDel).toHaveBeenCalledWith("/v1/users/4242");
      expect(mockClearSession).toHaveBeenCalled();
      expect(mockSetQueryData).toHaveBeenCalledWith(
        ["fetchProfile", "auth"],
        null,
      );
      expect(mockRefreshLoggedInUser).toHaveBeenCalled();
      expect(mockDismiss).toHaveBeenCalledWith("/");
    });

    alertSpy.mockRestore();
  });

  test("button press is a no-op when there is no logged-in user", () => {
    mockCurrentUser = null;
    const alertSpy = jest
      .spyOn(Alert, "alert")
      .mockImplementation(() => undefined);

    const Screen = importScreen();
    const { getAllByText } = render(<Screen />);

    // confirmDelete bails immediately if !user?.id, so neither the alert
    // nor the API call should fire
    const matches = getAllByText("Delete account");
    fireEvent.press(matches[matches.length - 1]);

    expect(alertSpy).not.toHaveBeenCalled();
    expect(mockDel).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
