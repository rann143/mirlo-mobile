import { ActivityIndicator, Text, View, FlatList } from "react-native";
import MenuButton from "@/components/MenuButton";
import SearchButton from "@/components/SearchButton";
import { StyleSheet } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import TrackGroupItem from "@/components/TrackGroupItem";
import { useEffect } from "react";
import { useAppIsReadyContext } from "@/state/AppReadyContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as api from "../queries/fetch/fetchWrapper";
import { Link } from "expo-router";
import { useRouter } from "expo-router";

export default function Index() {
  const { setIsDataLoaded } = useAppIsReadyContext();
  const {
    isPending,
    isError,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<{ results: AlbumProps[] }>({
    queryKey: ["infiniteTrackGroups"],
    queryFn: ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      params.append("skip", String(pageParam));
      params.append("take", String(20));
      params.append("distinctArtists", "true");
      params.append("isReleased", "released");

      return api.get(`/v1/trackGroups?${params}`, {});
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.results.length === 20 ? allPages.length * 20 : null;
    },
  });
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const trackGroups = data?.pages.flatMap((page) => page.results) || [];

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
        <Text style={{ color: "red" }}>Error: {error.message}</Text>
      </View>
    );
  }

  const renderLoadingFooter = () => {
    if (!isFetching && !isFetchingNextPage) return null;

    return (
      <View style={{ marginVertical: 30 }}>
        <ActivityIndicator
          size="large"
          color="#BE3455"
          style={styles.loadSpinner}
        />
      </View>
    );
  };
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
          data={trackGroups}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/artist/[id]/album/[slug]/album-tracks",
                params: { id: item.artistId, slug: item.urlSlug },
              }}
            >
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
                trackGroupId={item.trackGroupId}
              ></TrackGroupItem>
            </Link>
          )}
          onEndReached={() => {
            if (!hasNextPage || isFetchingNextPage) {
              return;
            }
            fetchNextPage();
          }}
          onEndReachedThreshold={0.0}
          ListFooterComponent={renderLoadingFooter}
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
