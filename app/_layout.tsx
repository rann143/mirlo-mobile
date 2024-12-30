import { Stack, usePathname } from "expo-router";
import { PlayerContextProvider } from "@/state/PlayerContext";
import ProfileLink from "@/components/ProfileLink";
import { QueryClientWrapper } from "@/queries/QueryClientWrapper";
import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Clipboard from "expo-clipboard";

export default function RootLayout() {
  const pathname = usePathname();

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
      <PlayerContextProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: "Recent Releases" }}
          />
          <Stack.Screen
            name="artist/[id]/album/[slug]"
            options={{
              title: "Album",
              headerRight: () => <ProfileLink />,
            }}
          />
          <Stack.Screen name="login" options={{ title: "Login" }} />
        </Stack>
      </PlayerContextProvider>
      <DevToolsBubble onCopy={onCopy} />
    </QueryClientWrapper>
  );
}
