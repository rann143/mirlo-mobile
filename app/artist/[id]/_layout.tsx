import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="artist-page" options={{ headerShown: false }} />
        <Stack.Screen
          name="album/[slug]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      {/* <Player bottomDistance={50} /> */}
    </>
  );
}
