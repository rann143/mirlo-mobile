import { useEffect, useState } from "react";
import { Text, View, Image, FlatList, SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import { API_ROOT } from "@/constants/api-root";
import { useQuery } from "@tanstack/react-query";
import { queryTrackGroups } from "@/queries/queries";

const Item = ({ cover, title, artist, artistId, urlSlug }: AlbumProps) => (
  <View style={styles.listItem}>
    <Image source={{ uri: cover.sizes[120] }} style={styles.image} />
    <View style={{ marginLeft: 10 }}>
      <Link
        href={{
          pathname: "/artist/[id]/album/[slug]/album-tracks",
          params: { id: artistId, slug: urlSlug },
        }}
        style={{ color: "white", fontSize: 20 }}
      >
        {title}
      </Link>
      <Text style={{ color: "white" }}>{artist.name}</Text>
    </View>
  </View>
);

export default function Index() {
  const [albums, setAlbums] = useState<AlbumProps[]>([]);
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
            <Item
              cover={item.cover}
              title={item.title}
              artist={item.artist}
              artistId={item.artistId}
              urlSlug={item.urlSlug}
            ></Item>
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
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  text: {
    padding: 10,
    fontWeight: "bold",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: "#f0f0f0", // placeholder color while loading
  },
});
