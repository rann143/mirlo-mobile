import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, router } from "expo-router";
import ProfileLink from "@/components/ProfileLink";
import { Button } from "react-native";
import Player from "@/components/Player";
import React from "react";

export default function TabLayout() {
  return (
    <>
      <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Recent Releases",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="music" color={color} />
            ),
            headerRight: () => <ProfileLink />,
          }}
        />
        <Tabs.Screen
          name="collections"
          options={{
            title: "My Collection",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="book" color={color} />
            ),
            headerRight: () => <ProfileLink />,
          }}
        />
        <Tabs.Screen
          name="artist/[id]/album/[slug]"
          options={{
            headerShown: false,
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
