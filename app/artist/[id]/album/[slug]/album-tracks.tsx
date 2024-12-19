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
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";

type TrackProps = {
  title: string;
  audio: {
    url: string;
  };
  currentTrackUrl: string;
  setCurrentTrackURL: React.Dispatch<React.SetStateAction<string>>;
  player: {
    play: () => void;
    pause: () => void;
    playing: boolean;
  };
  isPlaying: boolean;
};

const PlayButton = ({
  title,
  audio,
  currentTrackUrl,
  setCurrentTrackURL,
  player,
  isPlaying,
}: TrackProps) => {
  function onPress() {
    if (`${API_ROOT}${audio.url}` !== currentTrackUrl) {
      setCurrentTrackURL(`${API_ROOT}${audio.url}`);
      return;
    }

    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }

  return (
    <TouchableOpacity style={styles.appButtonContainer} onPress={onPress}>
      <Text style={styles.appButtonText}>
        {`${API_ROOT}${audio.url}` === currentTrackUrl && isPlaying
          ? "Pause"
          : "Play"}
      </Text>
    </TouchableOpacity>
  );
};

const TrackItem = ({
  title,
  audio,
  currentTrackUrl,
  setCurrentTrackURL,
  player,
  isPlaying,
}: TrackProps) => (
  <View style={styles.listItem}>
    <PlayButton
      title={title}
      audio={audio}
      currentTrackUrl={currentTrackUrl}
      setCurrentTrackURL={setCurrentTrackURL}
      player={player}
      isPlaying={isPlaying}
    />
    <Text style={{ color: "white", fontSize: 20 }}>{title}</Text>
  </View>
);

// CURRENTLY ONLY PLAYS FIRST TRACK IN ALBUM
export default function AlbumTracks() {
  const { id, slug } = useLocalSearchParams();
  const [tracks, setTracks] = useState<TrackProps[]>([]);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string>("");

  const player = useVideoPlayer(currentTrackUrl);
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEffect(() => {
    const callback = async () => {
      const fetchedAlbum = await fetch(
        `${API_ROOT}/v1/trackGroups/${slug}/?artistId=${id}`
      ).then((response) => response.json());
      setTracks(fetchedAlbum.result.tracks);
    };
    callback();
  }, []);

  useEffect(() => {
    if (currentTrackUrl && player) {
      player.play();
    }
  }, [currentTrackUrl, player]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {currentTrackUrl && player && (
        <VideoView style={styles.video} player={player} />
      )}
      <View style={styles.container}>
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={styles.listContainer}
          data={tracks}
          renderItem={({ item }) => (
            <TrackItem
              title={item.title}
              audio={item.audio}
              currentTrackUrl={currentTrackUrl}
              setCurrentTrackURL={setCurrentTrackUrl}
              player={player}
              isPlaying={isPlaying}
            ></TrackItem>
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
