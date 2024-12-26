import { Stack, usePathname } from "expo-router";
import { PlayerContextProvider } from "@/state/PlayerContext";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";

function ProfileLink() {
  const icon = <Feather name="user" size={24} color="black" />;
  return <Link href="/">{icon}</Link>;
}

export default function RootLayout() {
  const pathname = usePathname();

  return (
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
      </Stack>
    </PlayerContextProvider>
  );
}
