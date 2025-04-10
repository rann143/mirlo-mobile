import {
  ActivityIndicator,
  Text,
  View,
  FlatList,
  SafeAreaView,
} from "react-native";
import { StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { queryTrackGroups } from "@/queries/queries";
import TrackGroupItem from "@/components/TrackGroupItem";
import { useEffect } from "react";
import { useAppIsReadyContext } from "@/state/AppReadyContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Footer from "@/components/Footer";
import { Pressable } from "react-native";

export default function Index() {
  const { setIsDataLoaded } = useAppIsReadyContext();
  const { isPending, isError, data, error, status } = useQuery(
    queryTrackGroups({ take: 20, orderBy: "random", distinctArtists: true })
  );
  const { top } = useSafeAreaInsets();
  const trackGroups = data?.results;

  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        setIsDataLoaded(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (isPending) {
    return (
      <View>
        <ActivityIndicator
          size="large"
          color="#BE3455"
          style={styles.loadSpinner}
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text style={{ color: "red" }}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: top, backgroundColor: "white" }}>
      <View style={styles.container}>
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
          <Ionicons
            name="menu-outline"
            size={30}
            style={{ color: "#d6d6d6", marginRight: 15 }}
          ></Ionicons>
        </View>
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={styles.listContainer}
          data={trackGroups}
          renderItem={({ item }) => (
            <TrackGroupItem
              id={item.id}
              cover={item.cover}
              title={item.title}
              artist={item.artist}
              artistId={item.artistId}
              urlSlug={item.urlSlug}
              userTrackGroupPurchases={item.userTrackGroupPurchases}
              releaseDate={item.releaseDate}
              tracks={item.tracks}
            ></TrackGroupItem>
          )}
        ></FlatList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  listContainer: {
    backgroundColor: "#FFF",
    zIndex: 10,
  },
  text: {
    padding: 10,
    fontWeight: "bold",
  },
  loadSpinner: {
    flex: 1,
  },
});
