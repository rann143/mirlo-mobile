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
import { useState, useEffect, useRef } from "react";
import { VscPlay } from "react-icons/vsc";
import { Video, ResizeMode } from "expo-av";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";

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

// CURRENTLY ONLY PLAYS FIRST TRACK IN ALBUM
export default function AlbumTracks() {
  const { id, slug } = useLocalSearchParams();
  const [tracks, setTracks] = useState<TrackProps[]>([]);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string>("");

  useEffect(() => {
    const callback = async () => {
      const fetchedAlbum = await fetch(
        `${API_ROOT}/v1/trackGroups/${slug}/?artistId=${id}`
      ).then((response) => response.json());
      setTracks(fetchedAlbum.result.tracks);

      if (fetchedAlbum.result.tracks.length > 0) {
        setCurrentTrackUrl(
          `${API_ROOT}${fetchedAlbum.result.tracks[0].audio.url}`
        );
      }
    };
    callback();
  }, []);

  const player = useVideoPlayer(currentTrackUrl, (player) => {
    if (currentTrackUrl) {
      player.loop = true;
      player.play();
    }
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  // console.log(tracks);
  if (tracks.length) {
    console.log(currentTrackUrl);
    console.log(player);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {currentTrackUrl && player && (
        <VideoView style={styles.video} player={player} />
      )}

      <Button
        title={isPlaying ? "Pause" : "Play"}
        onPress={() => {
          if (isPlaying) {
            player.pause();
          } else {
            player.play();
          }
        }}
      />
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
  playPauseButton: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: 0,
    height: 0,
    opacity: 0,
  },
});
