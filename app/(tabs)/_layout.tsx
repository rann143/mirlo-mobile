import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import { Link } from "expo-router";

function ProfileLink() {
  const icon = <Feather name="user" size={24} color="black" />;
  return (
    <Link href="/" style={{ marginRight: 15 }}>
      {icon}
    </Link>
  );
}

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
