import { Text, View, FlatList, SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { queryTrackGroups } from "@/queries/queries";
import TrackGroupItem from "@/components/TrackGroupItem";

export default function Index() {
  const { isPending, isError, data, error } = useQuery(
    queryTrackGroups({ take: 20, orderBy: "random", distinctArtists: true })
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
        <Text style={{ color: "red" }}>Error: {error.message}</Text>
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
    </SafeAreaView>
  );
}

export const isTrackOwnedOrPreview = (
  track: TrackProps,
  user?: LoggedInUser | null,
  trackGroup?: AlbumProps
): boolean => {
  if (track.isPreview) {
    return true;
  }
  if (
    trackGroup?.releaseDate &&
    new Date(trackGroup.releaseDate) > new Date()
  ) {
    return false;
  }
  if (!user) {
    return false;
  }
  const lookInTrackGroup = trackGroup ?? track.trackGroup;
  const ownsTrack = lookInTrackGroup.artist?.id === user.id;
  const boughtTrack = !!lookInTrackGroup.userTrackGroupPurchases?.find(
    (utgp) => utgp.userId === user.id
  );
  return ownsTrack || boughtTrack;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  listContainer: {
    backgroundColor: "#BE3455",
    paddingBottom: 160,
  },
  text: {
    padding: 10,
    fontWeight: "bold",
  },
});
