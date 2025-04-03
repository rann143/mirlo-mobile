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

export default function Index() {
  const { setIsDataLoaded } = useAppIsReadyContext();
  const { isPending, isError, data, error, status } = useQuery(
    queryTrackGroups({ take: 20, orderBy: "random", distinctArtists: true })
  );
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
  track: RNTrack,
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
  const ownsTrack = lookInTrackGroup.artistId === user.id;
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
  loadSpinner: {
    flex: 1,
  },
});
