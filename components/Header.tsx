import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import SearchBar from "./searchBar";

export default function Header() {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          width: "100%",
          height: 60,
          borderBottomWidth: 3,
          borderBottomColor: "#e8e9eb",
          backgroundColor: "white",
        }}
      >
        <Ionicons
          name="search-outline"
          size={30}
          style={{ color: "#d6d6d6" }}
        ></Ionicons>
        <SearchBar />
        <Ionicons
          name="menu-outline"
          size={30}
          style={{ color: "#d6d6d6", marginRight: 15 }}
        ></Ionicons>
      </View>
    </View>
  );
}
