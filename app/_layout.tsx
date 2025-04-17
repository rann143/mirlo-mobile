import { Stack } from "expo-router";
import { PlayerContextProvider } from "@/state/PlayerContext";
import { AuthContextProvider } from "@/state/AuthContext";
import { QueryClientWrapper } from "@/queries/QueryClientWrapper";
import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Clipboard from "expo-clipboard";
import Player from "@/components/Player";
import { StatusBar } from "expo-status-bar";
import TrackPlayer from "react-native-track-player";
import * as SplashScreen from "expo-splash-screen";
import { AppReadyContextProvider } from "@/state/AppReadyContext";
import { useCallback, useEffect, useState } from "react";
import ProfileLink from "@/components/ProfileLink";
import Footer from "@/components/Footer";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

TrackPlayer.registerPlaybackService(() => require("../scripts/service"));

export default function RootLayout() {
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  // Needed for TanStack Query Devtools
  const onCopy = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      return true;
    } catch {
      return false;
    }
  };

  const onLayoutRootView = useCallback(() => {
    if (isDataLoaded) {
      SplashScreen.hide();
    }
  }, [isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      SplashScreen.hide();
    }
  }, [isDataLoaded]);

  return (
    <AppReadyContextProvider
      value={{ isDataLoaded: isDataLoaded, setIsDataLoaded: setIsDataLoaded }}
    >
      <QueryClientWrapper>
        <AuthContextProvider>
          <PlayerContextProvider>
            <Stack screenOptions={{ animation: "none" }}>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="collections"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="artist/[id]"
                options={{
                  headerShown: false,
                  animation: "flip",
                }}
              />
            </Stack>
            <Footer />
            <StatusBar style="dark" backgroundColor="white" />
          </PlayerContextProvider>
        </AuthContextProvider>
        {/* <DevToolsBubble onCopy={onCopy} /> */}
      </QueryClientWrapper>
    </AppReadyContextProvider>
  );
}
