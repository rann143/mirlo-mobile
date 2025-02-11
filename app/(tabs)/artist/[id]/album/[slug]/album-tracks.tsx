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
import { isTrackOwnedOrPreview } from "@/app/(tabs)";
import { useAuthContext } from "@/state/AuthContext";

// Currently the difference between album-track.tsx and collections-tracks.tsx
// is that the back button navigates to different tabs depending on if this album
// is from recent releases (index page) or collections

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Number(seconds.toFixed(0)) % 60;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}

type TrackItemComponentProps = {
  track: TrackProps;
  album: AlbumProps;
};

const TrackItem = ({ track, album }: TrackItemComponentProps) => {
  const { user } = useAuthContext();

  const canPlayTrack = isTrackOwnedOrPreview(track, user, album);

  if (!canPlayTrack) {
    return (
      <View style={[styles.listItem, { backgroundColor: "white" }]}>
        <Text style={{ color: "grey", fontSize: 20, marginRight: 5 }}>
          {track.title}
        </Text>
        <Text style={{ color: "grey", fontSize: 20 }}>
          {track.audio.duration ? formatTime(track.audio.duration) : 0}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listItem}>
      {album?.tracks && (
        <PlayButton trackObject={track} albumTracks={album.tracks} />
      )}
      <Text style={{ color: "white", fontSize: 20, marginRight: 5 }}>
        {track.title}
      </Text>
      <Text style={{ color: "black", fontSize: 20 }}>
        {track.audio.duration ? formatTime(track.audio.duration) : 0}
      </Text>
    </View>
  );
};

export default function AlbumTracks() {
  const { id, slug } = useLocalSearchParams();
  const [tracks, setTracks] = useState<TrackProps[]>([]);
  const [album, setAlbum] = useState<AlbumProps>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { player, isPlaying, currentSource, setCurrentSource, setPlayerQueue } =
    usePlayer();

  useEffect(() => {
    // TODO: Refactor to use Tanstack Query

    const callback = async () => {
      const fetchedAlbum = await fetch(
        `${API_ROOT}/v1/trackGroups/${slug}/?artistId=${id}`
      ).then((response) => response.json());
      const copy = [...fetchedAlbum.result.tracks];
      copy.forEach((track: TrackProps) => {
        track.artist = fetchedAlbum.result.artist.name;
        track.albumId = fetchedAlbum.result.id;
        track.trackGroup = {
          cover: fetchedAlbum.result.cover,
          title: fetchedAlbum.result.title,
          artist: fetchedAlbum.result.artist,
          artistId: fetchedAlbum.result.artistId,
          urlSlug: fetchedAlbum.result.urlSlug,
          releaseDate: fetchedAlbum.result.releaseDate,
        };
      });
      setTracks(copy);
      setAlbum(fetchedAlbum.result);
      setIsLoading(false);
    };
    callback();
  }, [slug, id]);

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: album?.title || "Loading...",
          headerRight: () => <ProfileLink />,
          headerLeft: () => (
            <Button
              title="Back"
              onPress={() => {
                router.navigate("/");
              }}
            />
          ),
        }}
      />
      {currentSource && player && (
        <VideoView
          style={styles.video}
          player={player}
          nativeControls={true}
          showsTimecodes={true}
        />
      )}
      <View style={styles.container}>
        <FlatList
          style={{ width: "100%" }}
          contentContainerStyle={styles.listContainer}
          data={tracks}
          renderItem={({ item }) =>
            album ? <TrackItem track={item} album={album}></TrackItem> : null
          }
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
    // opacity: 0,
    // width: "100%",
    // height: 100,
    // borderColor: "black",
    // borderWidth: 1,
    // zIndex: 1,
    //opacity: 0,
  },
});
