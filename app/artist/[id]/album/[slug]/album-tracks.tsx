import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Button,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { API_ROOT } from "@/constants/api-root";
import { useState, useEffect } from "react";
import { VideoView } from "expo-video";
import { usePlayer } from "@/state/PlayerContext";
import ProfileLink from "@/components/ProfileLink";
import PlayButton from "@/components/PlayButton";

const TrackItem = ({ title, audio }: TrackProps) => (
  <View style={styles.listItem}>
    <PlayButton audioUrlFragment={audio.url} />
    <Text style={{ color: "white", fontSize: 20 }}>{title}</Text>
  </View>
);

export default function AlbumTracks() {
  const { id, slug } = useLocalSearchParams();
  const [tracks, setTracks] = useState<TrackProps[]>([]);
  const [albumTitle, setAlbumTitle] = useState<string>("");
  const router = useRouter();
  const { player, isPlaying, currentSource, setCurrentSource } = usePlayer();

  useEffect(() => {
    const callback = async () => {
      const fetchedAlbum = await fetch(
        `${API_ROOT}/v1/trackGroups/${slug}/?artistId=${id}`
      ).then((response) => response.json());
      setTracks(fetchedAlbum.result.tracks);
      setAlbumTitle(fetchedAlbum.result.title);
    };
    callback();
  }, [slug, id]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: albumTitle || "Loading...",
          headerRight: () => <ProfileLink />,
          headerLeft: () => (
            <Button title="Back" onPress={() => router.dismiss(1)} />
          ),
        }}
      />
      {currentSource && player && (
        <VideoView style={styles.video} player={player} />
      )}
      <View style={styles.container}>
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={styles.listContainer}
          data={tracks}
          renderItem={({ item }) => (
            <TrackItem title={item.title} audio={item.audio}></TrackItem>
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
  video: {
    width: 0,
    height: 0,
    opacity: 0,
  },
});
