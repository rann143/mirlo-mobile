import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Button,
  Image,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { VideoView } from "expo-video";
import { usePlayer } from "@/state/PlayerContext";
import ProfileLink from "@/components/ProfileLink";
import PlayButton from "@/components/PlayButton";
import { isTrackOwnedOrPreview } from "@/app/(tabs)";
import { useAuthContext } from "@/state/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { queryAlbum } from "@/queries/queries";
import { useEffect } from "react";
import { API_ROOT } from "@/constants/api-root";
import { API_KEY } from "@/constants/api-key";

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
  track: RNTrack;
  album: AlbumProps;
};

const TrackItem = ({ track, album }: TrackItemComponentProps) => {
  const { user } = useAuthContext();

  const canPlayTrack = isTrackOwnedOrPreview(track, user, album);

  if (!canPlayTrack) {
    return (
      <View style={[styles.listItem, { backgroundColor: "#BE3455" }]}>
        <Text style={{ color: "darkgrey", fontSize: 20, marginRight: 5 }}>
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "70%",
        }}
      >
        {album?.tracks && (
          <PlayButton trackObject={track} albumTracks={album.tracks} />
        )}
        <Text
          style={{ color: "white", fontSize: 20, marginRight: 5 }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {track.title}
        </Text>
      </View>
      <Text style={{ color: "white", fontSize: 15, marginRight: 20 }}>
        {track.audio.duration ? formatTime(track.audio.duration) : 0}
      </Text>
    </View>
  );
};

export default function AlbumTracks() {
  const { id, slug } = useLocalSearchParams();
  const { isPending, isError, data, error } = useQuery(
    queryAlbum({ slug: slug, id: id })
  );
  const router = useRouter();
  const { album, setAlbum } = usePlayer();

  useEffect(() => {
    const tracks: RNTrack[] = [];
    if (data && data.result.tracks) {
      data.result.tracks.forEach((track) => {
        const newTrack: RNTrack = {
          title: track.title,
          artist: data.result.artist.name,
          artwork: data.result.cover.sizes[60],
          url: `${API_ROOT}${track.audio.url}`,
          trackGroup: {
            userTrackGroupPurchases: data.result.userTrackGroupPurchases,
            artistId: data.result.artistId,
            urlSlug: data.result.urlSlug,
          },
          audio: {
            url: track.audio.url,
            duration: track.audio.duration,
          },
          isPreview: track.isPreview,
          order: track.order,
          headers: {
            "mirlo-api-key": API_KEY,
          },
        };
        tracks.push(newTrack);
      });
    }

    setAlbum(tracks);
  }, [data]);

  if (isPending) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text>Error: {error.message} </Text>
      </View>
    );
  }

  const selectedAlbum = data.result;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: selectedAlbum?.title || "Loading...",
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
      <View style={styles.container}>
        <FlatList
          style={{ width: "100%", marginTop: 10 }}
          contentContainerStyle={styles.listContainer}
          data={album}
          renderItem={({ item }) =>
            selectedAlbum ? (
              <TrackItem track={item} album={selectedAlbum}></TrackItem>
            ) : null
          }
          ListHeaderComponent={() => (
            <View>
              <Image
                source={{ uri: selectedAlbum.cover?.sizes[960] }}
                style={styles.image}
              />
              <Text
                style={{
                  textAlign: "center",
                  color: "rgba(255,255,255,0.9)",
                  marginBottom: 5,
                }}
              >
                {selectedAlbum.artist.name} | {selectedAlbum.tracks?.length}{" "}
                {selectedAlbum.tracks?.length == 1 ? "Track" : "Tracks"} |{" "}
                {new Date(selectedAlbum.releaseDate).getFullYear()}
              </Text>
            </View>
          )}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BE3455",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  listContainer: {
    backgroundColor: "#BE3455",
    paddingBottom: 160,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    justifyContent: "space-between",
    marginTop: 5,
  },
  listHeader: {
    alignContent: "center",
  },
  text: {
    padding: 10,
    fontWeight: "bold",
  },
  image: {
    width: 170,
    height: 170,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "#f0f0f0", // placeholder color while loading
    alignSelf: "center",
  },
  video: {
    width: 0,
    height: 0,
  },
});
