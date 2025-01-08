import { Text, View, FlatList, SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { queryTrackGroups } from "@/queries/queries";
import TrackGroupItem from "@/components/TrackGroupItem";

export default function Index() {
  const { isPending, isError, data, error } = useQuery(
    queryTrackGroups({ take: 20, distinctArtists: true })
  );
  const trackGroups = data?.results;

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={styles.listContainer}
          data={trackGroups}
          renderItem={({ item }) => (
            <TrackGroupItem
              cover={item.cover}
              title={item.title}
              artist={item.artist}
              artistId={item.artistId}
              urlSlug={item.urlSlug}
            ></TrackGroupItem>
          )}
        ></FlatList>
      </View>
    </SafeAreaView>
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
