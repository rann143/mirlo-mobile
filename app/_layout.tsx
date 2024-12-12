import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Mirlo",
        }}
      />
      <Stack.Screen
        name="album-tracks"
        options={{
          title: "Album Tracks",
        }}
      />
    </Stack>
  );
}
