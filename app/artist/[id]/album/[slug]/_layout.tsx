import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="album-tracks" options={{ headerShown: false }} />
    </Stack>
  );
}
