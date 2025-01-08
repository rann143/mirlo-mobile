import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="album-tracks" options={{ headerShown: true }} />
    </Stack>
  );
}
