import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
} from "react-native";
import MenuButton from "@/components/MenuButton";
import { useLocalSearchParams, Link } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as api from "../../queries/fetch/fetchWrapper";
import TrackGroupItem from "@/components/TrackGroupItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import ErrorNotification from "@/components/ErrorNotification";
import { useState } from "react";
export default function TagsView() {
  const { tag } = useLocalSearchParams();

  const [showError, setShowError] = useState<boolean>(true);

  const {
    isPending,
    isError,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<{ results: AlbumProps[] }>({
    queryKey: ["infiniteTrackGroups", tag],
    queryFn: ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      params.append("skip", String(pageParam));
      params.append("take", String(20));
      params.append("tag", String(tag));

      return api.get(`/v1/trackGroups?${params}`, {});
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.results.length === 20 ? allPages.length * 10 : null;
    },
  });
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const trackGroups = data?.pages.flatMap((page) => page.results) || [];
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
    console.error(error);
    return (
      <View style={{ flex: 1 }}>
        <ErrorNotification
          visible={showError}
          onDismiss={() => setShowError(false)}
          error={error}
        />
      </View>
    );
  }

  const renderLoadingFooter = () => {
    if (!isFetchingNextPage) return null;

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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Pressable onPress={() => router.dismiss()}>
              <Ionicons
                name="chevron-back-outline"
                size={40}
                style={{ color: "#696969" }}
              ></Ionicons>
            </Pressable>
            <Text style={{ fontSize: 15 }}>Tag: {tag}</Text>
          </View>
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
          onEndReached={() => !isFetchingNextPage && fetchNextPage()}
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
