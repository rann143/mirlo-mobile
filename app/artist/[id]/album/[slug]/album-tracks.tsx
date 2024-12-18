import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { API_ROOT } from "@/constants/api-root";
import { useState, useEffect } from "react";
import { VscPlay } from "react-icons/vsc";
import { Audio } from "expo-av";

type TrackProps = {
  title: string;
  audio: {
    url: string;
  };
};

// Not Yet Functional
const PlayButton = () => {
  return (
    <TouchableOpacity style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>Play</Text>
    </TouchableOpacity>
  );
};

const TrackItem = ({ title, audio }: TrackProps) => (
  <View style={styles.listItem}>
    <PlayButton />
    <Text style={{ color: "white", fontSize: 20 }}>{title}</Text>
  </View>
);

export default function AlbumTracks() {
  const { id, slug } = useLocalSearchParams();
  const [tracks, setTracks] = useState<TrackProps[]>([]);

  // ************************
  // Current Goal is just to get first song in tracks to play. Then focus on being able to play all displayed songs
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);

  async function playSound() {
    try {
      console.log("Loading Sound");
      // Unload existing sound if any
      if (currentSound) {
        await currentSound.unloadAsync();
      }

      const soundUri = API_ROOT + tracks[0].audio.url;
      // console.log(soundUri);

      const { sound: playBackObject } = await Audio.Sound.createAsync(
        { uri: soundUri },
        { shouldPlay: true }
      );

      setCurrentSound(playBackObject);
    } catch (err) {
      console.log(err);
    }
  }

  // ************************

  useEffect(() => {
    const callback = async () => {
      const fetchedAlbum = await fetch(
        `${API_ROOT}/v1/trackGroups/${slug}/?artistId=${id}`
      ).then((response) => response.json());
      setTracks(fetchedAlbum.result.tracks);
    };
    callback();

    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [currentSound]);

  // console.log(tracks);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Button title="Play First Track (Testing)" onPress={playSound} />
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
  appButtonContainer: {
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
