import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import { Link } from "expo-router";
import ProfileLink from "@/components/ProfileLink";

export default function TabLayout() {
  return (
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
          title: "My Collections",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="book" color={color} />
          ),
          headerRight: () => <ProfileLink />,
        }}
      />
    </Tabs>
  );
}
