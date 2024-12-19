import { Stack, usePathname } from "expo-router";
import { PlayerContextProvider } from "@/state/PlayerContext";

export default function RootLayout() {
  const pathname = usePathname();

  return (
    <PlayerContextProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Mirlo",
          }}
        />
        <Stack.Screen
          name="artist/[id]/album/[slug]"
          options={{
            title: "Album",
          }}
        />
      </Stack>
    </PlayerContextProvider>
  );
}
