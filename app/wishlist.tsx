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

export default function Collections() {
  const { user } = useAuthContext();
  const userId = user?.id;
  const { top } = useSafeAreaInsets();
  const { isPending, isError, data, error } = useQuery(queryWishlist(userId));
  const [list, setList] = useState<
    (
      | {
          userId: number;
          trackGroupId: number;
          trackGroup: AlbumProps;
          createdAt: Date;
        }
      | { userId: number; trackId: number; track: RNTrack }
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
    setList([...(wishlist ?? []), ...(trackFavorites ?? [])]);
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

  if (!wishlist) {
    return <Text>No wishlist found</Text>;
  }
  console.log(wishlist);
  console.log(trackFavorites);
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
          renderItem={
            ({ item }) => {
              if (isWishlisted(item) && item.trackGroup) {
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
              }
              return null;
            }
            // <Link
            //   href={{
            //     pathname: "/artist/[id]/album/[slug]/album-tracks",
            //     params: {
            //       id: item.trackGroup.artistId,
            //       slug: item.trackGroup.urlSlug,
            //     },
            //   }}
            // >
            //   <TrackGroupItem
            //     id={item.trackGroup.id}
            //     cover={item.trackGroup.cover}
            //     title={item.trackGroup.title}
            //     artist={item.trackGroup.artist}
            //     artistId={item.trackGroup.artistId}
            //     urlSlug={item.trackGroup.urlSlug}
            //     userTrackGroupPurchases={
            //       item.trackGroup.userTrackGroupPurchases
            //     }
            //     releaseDate={item.trackGroup.releaseDate}
            //     tracks={item.trackGroup.tracks}
            //     trackGroupId={item.trackGroupId}
            //   ></TrackGroupItem>
            // </Link>
          }
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
