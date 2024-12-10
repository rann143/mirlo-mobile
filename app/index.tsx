import { Text, View, Image, FlatList, SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
const logo = require("../assets/images/react-logo.png");

type ItemProps = { img_uri: any; title: string; artist: string };

const Item = ({ img_uri, title, artist }: ItemProps) => (
  <View style={styles.listItem}>
    <Image source={img_uri} style={styles.image} />
    <Text style={{ color: "white", fontSize: 20 }}>{title}</Text>
    <Text style={{ color: "white" }}>{artist}</Text>
  </View>
);

export default function Index() {
  const recentAlbums = new Array(15).fill(null).map((_, index) => ({
    img_uri: logo,
    title: `album ${index + 1}`,
    artist: `artist ${index + 1}`,
  }));
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.text}>Recent Releases</Text>
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={styles.listContainer}
          data={recentAlbums}
          renderItem={({ item }) => (
            <Item
              img_uri={item.img_uri}
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
    justifyContent: "space-evenly",
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
