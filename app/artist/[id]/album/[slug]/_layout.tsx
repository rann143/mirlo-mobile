import { Stack } from "expo-router";
import React from "react";
import Player from "@/components/Player";

export default function Layout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="album-tracks"
          options={{ headerShown: false, animation: "none" }}
        />
      </Stack>
    </>
  );
}
