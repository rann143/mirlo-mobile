import { useEffect, useState } from "react";
import { Text, View, Image, FlatList, SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
const logo = require("../assets/images/react-logo.png");

type AlbumProps = {
  cover: {
    sizes: {
      60: string;
      120: string;
      300: string;
      600: string;
      960: string;
      1200: string;
      1500: string;
    };
  };
  title: string;
  artist: { name: string };
};

const Item = ({ cover, title, artist }: AlbumProps) => (
  <View style={styles.listItem}>
    <Image source={{ uri: cover.sizes[120] }} style={styles.image} />
    <View style={{ marginLeft: 10 }}>
      <Text style={{ color: "white", fontSize: 20 }}>{title}</Text>
      <Text style={{ color: "white" }}>{artist.name}</Text>
    </View>
  </View>
);

export default function Index() {
  const [albums, setAlbums] = useState<AlbumProps[]>([]);

  useEffect(() => {
    const callback = async () => {
      const fetchedAlbums = await fetch(
        "https://api.mirlo.space/v1/trackGroups?take=20"
      ).then((response) => response.json());
      setAlbums(fetchedAlbums.results);
    };
    callback();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.text}>Recent Releases</Text>
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={styles.listContainer}
          data={albums}
          renderItem={({ item }) => (
            <Item
              cover={item.cover}
              title={item.title}
              artist={item.artist}
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
