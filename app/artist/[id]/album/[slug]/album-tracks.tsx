import {
  Text,
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { API_ROOT } from "@/constants/api-root";
import { useState, useEffect } from "react";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePlayer } from "@/state/PlayerContext";

type TrackProps = {
  title: string;
  audio: {
    url: string;
  };
};

const PlayButton = ({ title, audio }: TrackProps) => {
  const { player, isPlaying, currentSource, setCurrentSource } = usePlayer();
  const playIcon = <Ionicons name="play" size={20} />;
  const pauseIcon = <Ionicons name="pause" size={20} />;
  const audioURL = `${API_ROOT}${audio.url}`;

  function onPress() {
    // check button's associated song url against current audio source to determine
    // if we need to change the player's audio source
    if (audioURL !== currentSource) {
      player.replace(audioURL);
      player.play();
      setCurrentSource(audioURL);
      return;
    }

    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }

  return (
    <TouchableOpacity style={styles.playPauseButtonContainer} onPress={onPress}>
      <Text style={styles.playPauseButtonText}>
        {audioURL === currentSource && isPlaying ? pauseIcon : playIcon}
      </Text>
    </TouchableOpacity>
  );
};

const TrackItem = ({ title, audio }: TrackProps) => (
  <View style={styles.listItem}>
    <PlayButton title={title} audio={audio} />
    <Text style={{ color: "white", fontSize: 20 }}>{title}</Text>
  </View>
);

export default function AlbumTracks() {
  const { id, slug } = useLocalSearchParams();
  const [tracks, setTracks] = useState<TrackProps[]>([]);
  const { player, isPlaying, currentSource, setCurrentSource } = usePlayer();

  useEffect(() => {
    const callback = async () => {
      const fetchedAlbum = await fetch(
        `${API_ROOT}/v1/trackGroups/${slug}/?artistId=${id}`
      ).then((response) => response.json());
      setTracks(fetchedAlbum.result.tracks);
    };
    callback();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
  playPauseButtonContainer: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  playPauseButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  video: {
    width: 0,
    height: 0,
    opacity: 0,
  },
});
