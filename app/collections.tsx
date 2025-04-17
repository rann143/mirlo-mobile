import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { useAuthContext } from "@/state/AuthContext";
import { Link, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { queryUserPurchases } from "@/queries/queries";
import { useEffect } from "react";
import TrackGroupItem from "@/components/TrackGroupItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Collections() {
  const { user } = useAuthContext();
  const userId = user?.id;
  const { top } = useSafeAreaInsets();
  const { isPending, isError, data, error } = useQuery(
    queryUserPurchases(userId)
  );
  const purchases = data?.results;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  if (isPending) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  if (!purchases) {
    return <Text>No purchases found</Text>;
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
          data={purchases}
          keyExtractor={(item, index) => `${item.trackGroup.id}-${index}`}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/artist/[id]/album/[slug]/album-tracks",
                params: {
                  id: item.trackGroup.artistId,
                  slug: item.trackGroup.urlSlug,
                },
              }}
            >
              <TrackGroupItem
                id={item.trackGroup.id}
                cover={item.trackGroup.cover}
                title={item.trackGroup.title}
                artist={item.trackGroup.artist}
                artistId={item.trackGroup.artistId}
                urlSlug={item.trackGroup.urlSlug}
                userTrackGroupPurchases={
                  item.trackGroup.userTrackGroupPurchases
                }
                releaseDate={item.trackGroup.releaseDate}
                tracks={item.trackGroup.tracks}
              ></TrackGroupItem>
            </Link>
          )}
        ></FlatList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  listContainer: {
    backgroundColor: "#FFF",
  },
  text: {
    padding: 10,
    fontWeight: "bold",
  },
});
