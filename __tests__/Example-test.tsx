import { render, fireEvent, waitFor } from "@testing-library/react-native";

import LoginForm from "@/components/LoginForm";
import { useLoginMutation } from "@/queries/authQueries";
import { useRouter } from "expo-router";

// Mocking the hooks
jest.mock("@/queries/authQueries", () => ({
  useLoginMutation: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("<LoginForm />", () => {
  const mockLogin = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useLoginMutation as jest.Mock).mockReturnValue({
      mutate: mockLogin,
    });

    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  test("Login text renders properly", () => {
    const { getByText, getByPlaceholderText } = render(<LoginForm />);

    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Email:")).toBeTruthy();
    expect(getByText("Password:")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Submit")).toBeTruthy();
  });

  test("displays validation errors when submitting empty form", async () => {
    const { getByText, queryByText, getAllByText } = render(<LoginForm />);

    expect(queryByText("This is required.")).toBeNull();

    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(getAllByText("This is required.")).toBeTruthy();
    });
  });
});
