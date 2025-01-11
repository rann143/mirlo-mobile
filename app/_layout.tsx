import { Stack, usePathname } from "expo-router";
import { PlayerContextProvider } from "@/state/PlayerContext";
import { AuthContextProvider } from "@/state/AuthContext";
import ProfileLink from "@/components/ProfileLink";
import { QueryClientWrapper } from "@/queries/QueryClientWrapper";
import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Clipboard from "expo-clipboard";
import Player from "@/components/Player";

export default function RootLayout() {
  const pathname = usePathname();

  // Needed for TanStack Query Devtools
  const onCopy = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <QueryClientWrapper>
      <AuthContextProvider>
        <PlayerContextProvider>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, title: "Recent Releases" }}
            />
            <Stack.Screen
              name="artist/[id]/album/[slug]"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="login" options={{ title: "Login" }} />
          </Stack>
          <Player />
        </PlayerContextProvider>
      </AuthContextProvider>
      <DevToolsBubble onCopy={onCopy} />
    </QueryClientWrapper>
  );
}
