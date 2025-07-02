import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useAuthContext } from "@/state/AuthContext";
import { Link, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { queryUserPurchases } from "@/queries/queries";
import { useEffect } from "react";
import TrackGroupItem from "@/components/TrackGroupItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuButton from "@/components/MenuButton";
import SearchButton from "@/components/SearchButton";
import CollectionPurchase from "@/components/CollectionPurchase";
import { isTrackGroupPurchase, isTrackPurchase } from "@/types/typeguards";

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
      <View style={{ flex: 1 }}>
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
          <SearchButton />
          <MenuButton />
        </View>
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={styles.listContainer}
          data={purchases}
          keyExtractor={(item, index) => `${item.trackGroup.id}-${index}`}
          renderItem={({ item }) => {
            if (isTrackGroupPurchase(item) && item.trackGroup) {
              return (
                <Link
                  href={{
                    pathname: "/artist/[id]/album/[slug]/album-tracks",
                    params: {
                      id: item.trackGroup.artistId,
                      slug: item.trackGroup.urlSlug,
                    },
                  }}
                >
                  <CollectionPurchase trackGroup={item.trackGroup} />
                </Link>
              );
            } else if (isTrackPurchase(item)) {
              return (
                <Link
                  href={{
                    pathname: "/artist/[id]/album/[slug]/tracks/[trackId]",
                    params: {
                      id: item.trackGroup.artistId,
                      slug: item.trackGroup.urlSlug,
                      trackId: item.trackId,
                    },
                  }}
                >
                  <CollectionPurchase
                    trackGroup={item.trackGroup}
                    track={item.track}
                  />
                </Link>
              );
            }
            return null;
          }}
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
  loadSpinner: {
    flex: 1,
  },
});
