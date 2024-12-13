import { Stack, usePathname } from "expo-router";

export default function RootLayout() {
  const pathname = usePathname();

  return (
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
  );
}
