import { Text, View, SafeAreaView, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { API_ROOT } from "@/constants/api-root";
import { useState, useEffect } from "react";
import { VscPlay } from "react-icons/vsc";

type TrackProps = {
  title: string;
};

const TrackItem = ({ title }: TrackProps) => (
  <View style={styles.listItem}>
    <Text style={{ color: "white", fontSize: 20 }}>{title}</Text>
  </View>
);

export default function AlbumTracks() {
  const { id, slug } = useLocalSearchParams();
  const [tracks, setTracks] = useState<TrackProps[]>([]);

  useEffect(() => {
    const callback = async () => {
      const fetchedAlbum = await fetch(
        `${API_ROOT}v1/trackGroups/${slug}/?artistId=${id}`
      ).then((response) => response.json());
      setTracks(fetchedAlbum.result.tracks);
    };
    callback();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={styles.listContainer}
          data={tracks}
          renderItem={({ item }) => <TrackItem title={item.title}></TrackItem>}
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
