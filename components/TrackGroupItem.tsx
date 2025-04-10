import { View, Text, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function TrackGroupItem({
  id,
  cover,
  title,
  artist,
  artistId,
  urlSlug,
}: AlbumProps) {
  return (
    <View style={styles.listItem}>
      <Image source={{ uri: cover?.sizes[120] }} style={styles.image} />
      <View style={{ marginLeft: 15, width: 200 }}>
        <Link
          href={{
            pathname: "/artist/[id]/album/[slug]/album-tracks",
            params: { id: artistId, slug: urlSlug },
          }}
          style={{ color: "black", fontSize: 15, fontWeight: "bold" }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {title}
        </Link>
        <Text style={{ color: "black", fontSize: 14 }}>{artist.name}</Text>
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
    borderRadius: 1,
    backgroundColor: "#f0f0f0", // placeholder color while loading
  },
});
