import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { useAuthContext } from "@/state/AuthContext";
import ProfileLink from "@/components/ProfileLink";
import { Link, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import CollectionsGroupItem from "@/components/CollectionsgroupItem";
import { queryUserPurchases } from "@/queries/queries";

export default function Collections() {
  const { user } = useAuthContext();
  const userId = user?.id;

  const { isPending, isError, data, error } = useQuery(
    queryUserPurchases(userId)
  );
  const purchases = data?.results;

  if (!user) {
    router.push("/login");
  }

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
    <View style={styles.container}>
      <FlatList
        style={{ width: "100%" }}
        contentContainerStyle={styles.listContainer}
        data={purchases}
        renderItem={({ item }) => (
          <CollectionsGroupItem
            id={item.trackGroup.id}
            cover={item.trackGroup.cover}
            title={item.trackGroup.title}
            artist={item.trackGroup.artist}
            artistId={item.trackGroup.artistId}
            urlSlug={item.trackGroup.urlSlug}
            releaseDate={item.trackGroup.releaseDate}
          ></CollectionsGroupItem>
        )}
      />
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
    backgroundColor: "#BE3455",
  },
  text: {
    padding: 10,
    fontWeight: "bold",
  },
});
