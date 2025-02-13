import { View, Text, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function TrackGroupItem({
  cover,
  title,
  artist,
  artistId,
  urlSlug,
}: AlbumProps) {
  return (
    <View style={styles.listItem}>
      <Image source={{ uri: cover?.sizes[120] }} style={styles.image} />
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
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: "#f0f0f0", // placeholder color while loading
  },
});
