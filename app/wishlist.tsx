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
import { queryUserPurchases, queryWishlist } from "@/queries/queries";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuButton from "@/components/MenuButton";
import SearchButton from "@/components/SearchButton";
import CollectionPurchase from "@/components/CollectionPurchase";
import {
  isFavoritedTrack,
  isTrackGroupPurchase,
  isTrackPurchase,
  isWishlisted,
} from "@/types/typeguards";
import TrackGroupItem from "@/components/TrackGroupItem";
import { useTranslation } from "react-i18next";

export default function Collections() {
  const { user } = useAuthContext();
  const userId = user?.id;
  const { top } = useSafeAreaInsets();
  const { isPending, isError, data, error } = useQuery(queryWishlist(userId));
  const { t } = useTranslation();
  const [list, setList] = useState<
    (
      | {
          userId: number;
          trackGroupId: number;
          trackGroup: AlbumProps;
          createdAt: Date;
        }
      | { userId: number; trackId: number; track: RNTrack }
      | string
    )[]
  >([]);
  const wishlist = data?.results;
  const trackFavorites = user?.trackFavorites;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  useEffect(() => {
    setList([
      t("profile.yourWishlist"),
      "github action",
      ...(wishlist ?? []),
      t("profile.favoritedTracks"),
      ...(trackFavorites ?? []),
    ]);
  }, [wishlist, trackFavorites]);

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

  if (!wishlist && !trackFavorites) {
    return <Text>No wishlist found</Text>;
  }
  // console.log(wishlist);
  // console.log(trackFavorites);
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
          data={list}
          //keyExtractor={(item, index) => `${item.trackGroupId}-${index}`}
          renderItem={({ item }) => {
            if (isWishlisted(item)) {
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
            } else if (isFavoritedTrack(item)) {
              return (
                <Link
                  href={{
                    pathname: "/artist/[id]/album/[slug]/tracks/[trackId]",
                    params: {
                      id: item.track.trackGroup.artistId,
                      slug: item.track.trackGroup.urlSlug,
                      trackId: item.trackId,
                    },
                  }}
                >
                  <CollectionPurchase
                    trackGroup={item.track.trackGroup}
                    track={item.track}
                  />
                </Link>
              );
            } else if (typeof item === "string") {
              return (
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text style={styles.listText}>{item}</Text>
                </View>
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
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  listContainer: {
    backgroundColor: "#FFF",
    paddingBottom: 10,
  },
  text: {
    padding: 10,
    fontWeight: "bold",
  },
  listText: {
    padding: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  loadSpinner: {
    flex: 1,
  },
});
