import { Stack, usePathname } from "expo-router";
import { SearchContextProvider } from "@/state/SearchContext";
import { PlayerContextProvider } from "@/state/PlayerContext";
import { AuthContextProvider } from "@/state/AuthContext";
import { QueryClientWrapper } from "@/queries/QueryClientWrapper";
import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Clipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";
import TrackPlayer from "react-native-track-player";
import * as SplashScreen from "expo-splash-screen";
import { AppReadyContextProvider } from "@/state/AppReadyContext";
import { useCallback, useEffect, useState } from "react";
import Footer from "@/components/Footer";
import "../i18n";

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
            <SearchContextProvider>
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
                    animation: "none",
                  }}
                />
                <Stack.Screen
                  name="now-playing"
                  options={{
                    presentation: "modal",
                    animation: "slide_from_bottom",
                    animationDuration: 100,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="search"
                  options={{
                    headerShown: false,
                    animation: "fade",
                    animationDuration: 300,
                    presentation: "transparentModal",
                  }}
                />
                <Stack.Screen
                  name="menu"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="tags/[tag]"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="mostPlayed"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="topSold"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="wishlist"
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
              <Footer />
              <StatusBar style="dark" backgroundColor="white" />
            </SearchContextProvider>
          </PlayerContextProvider>
        </AuthContextProvider>
        {/* <DevToolsBubble onCopy={onCopy} /> */}
      </QueryClientWrapper>
    </AppReadyContextProvider>
  );
}
