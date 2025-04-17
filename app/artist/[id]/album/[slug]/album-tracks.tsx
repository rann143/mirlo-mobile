import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Button,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter, Link } from "expo-router";
import { usePlayer } from "@/state/PlayerContext";
import { isTrackOwnedOrPreview } from "@/scripts/utils";
import { useAuthContext } from "@/state/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { queryAlbum } from "@/queries/queries";
import { useEffect, useState } from "react";
import { API_ROOT } from "@/constants/api-root";
import { API_KEY } from "@/constants/api-key";
import TrackPlayer, { PlaybackState, State } from "react-native-track-player";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TrackItem } from "@/components/TrackItem";
import PlayPauseWrapper from "@/components/PlayButton";

type DateTimeFormatOptions = Intl.DateTimeFormatOptions;

// Currently the difference between album-track.tsx and collections-tracks.tsx
// is that the back button navigates to different tabs depending on if this album
// is from recent releases (index page) or collections

function AlbumPlayButton() {
  const { playbackState, activeTrack, playableTracks, setActiveTrack } =
    usePlayer();

  const togglePlayBack = async (
    playBackState: PlaybackState | { state: undefined }
  ) => {
    try {
      const queue = await TrackPlayer.getQueue();
      // Set queue if no queue currently set
      if (!queue) {
        console.log("no curr track: setting track");
        await TrackPlayer.setQueue(playableTracks);
        await TrackPlayer.play();
        const current = (await TrackPlayer.getActiveTrack()) as RNTrack;
        const q = await TrackPlayer.getQueue();
        console.log(q);
        setActiveTrack(current);
        return;
      }

      const currentTrack = await TrackPlayer.getActiveTrack();

      const isSameAlbum =
        currentTrack?.trackGroup.urlSlug ===
        playableTracks[0].trackGroup.urlSlug
          ? true
          : false;

      // Song Change to different album
      if (!isSameAlbum) {
        try {
          await TrackPlayer.setQueue(playableTracks);
          await TrackPlayer.play();
          const current = (await TrackPlayer.getActiveTrack()) as RNTrack;
          setActiveTrack(current);
          return;
        } catch (err) {
          console.error("issue changing albums", err);
          return;
        }
      }

      if (
        playbackState.state === State.Paused ||
        playbackState.state === State.Ready
      ) {
        await TrackPlayer.play();
        return;
      } else if (playbackState.state === State.Playing) {
        await TrackPlayer.pause();
        return;
      } else {
        console.log(playbackState.state);
        return;
      }
    } catch (err) {
      console.error("issue with playback", err);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => togglePlayBack(playbackState)}
      disabled={playableTracks ? false : true}
    >
      <Ionicons
        name={
          playbackState.state === State.Playing &&
          activeTrack?.trackGroup?.urlSlug ===
            playableTracks[0].trackGroup?.urlSlug
            ? "pause-circle-outline"
            : "play-circle-outline"
        }
        size={60}
        style={{ marginHorizontal: 5 }}
        color={playableTracks ? "black" : "lightgrey"}
      />
    </TouchableOpacity>
  );
}

function formatUTCDate(utcDate: string | undefined) {
  if (!utcDate) return undefined;
  const date = new Date(utcDate);

  // Account for timezone offset
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  const options: DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const result = localDate.toLocaleDateString("en-US", options);

  return date.getTime() > Date.now()
    ? `Will be released on ${result}`
    : `Released ${result}`;
}

export default function AlbumTracks() {
  const { id, slug } = useLocalSearchParams();
  const { isPending, isError, data, error } = useQuery(
    queryAlbum({ slug: slug, id: id })
  );
  const router = useRouter();
  const { playableTracks, setPlayableTracks } = usePlayer();
  const [album, setAlbum] = useState<RNTrack[]>();

  useEffect(() => {
    const tracksToPlay: RNTrack[] = [];
    const allTracks: RNTrack[] = [];
    if (data && data.result.tracks) {
      data.result.tracks.forEach((track) => {
        const newTrack: RNTrack = {
          title: track.title,
          artist: data.result.artist.name,
          artwork: data.result.cover.sizes[600],
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
        allTracks.push(newTrack);

        if (newTrack.isPreview === true) {
          tracksToPlay.push(newTrack);
        }
      });
    }
    setAlbum(allTracks);
    setPlayableTracks(tracksToPlay);
  }, [data]);

  if (isPending) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator
          size="large"
          color="#BE3455"
          style={styles.loadSpinner}
        />
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

  const tagPills = selectedAlbum.tags?.map((tag, index) => {
    return (
      <View
        key={index}
        style={{
          backgroundColor: "#f0f0f0",
          borderWidth: 1,
          borderColor: "#e3e1e1",
          padding: 10,
          paddingHorizontal: 15,
          borderRadius: 18,
          marginRight: 10,
          marginVertical: 5,
        }}
      >
        <Text>{tag}</Text>
      </View>
    );
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          width: "100%",
          height: 60,
          backgroundColor: "#fafafa",
        }}
      >
        <Pressable onPress={() => router.dismiss()}>
          <Ionicons
            name="chevron-back-outline"
            size={40}
            style={{ color: "#696969" }}
          ></Ionicons>
        </Pressable>
      </View>
      <View style={styles.container}>
        <FlatList
          style={{ width: "100%", marginTop: 10 }}
          contentContainerStyle={styles.listContainer}
          data={album}
          renderItem={({ item }) =>
            selectedAlbum ? (
              <PlayPauseWrapper
                trackObject={item}
                selectedAlbum={selectedAlbum}
              ></PlayPauseWrapper>
            ) : null
          }
          ListHeaderComponent={() => (
            <View style={{ marginBottom: 10 }}>
              <Image
                source={{ uri: selectedAlbum?.cover?.sizes[600] }}
                style={styles.image}
                resizeMode="contain"
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "black",
                      marginBottom: 5,
                      fontWeight: "bold",
                    }}
                  >
                    {selectedAlbum?.title}
                  </Text>
                  <Text>
                    By{" "}
                    <Link
                      href={{
                        pathname: "/artist/[id]/artist-page",
                        params: { id: selectedAlbum?.artistId },
                      }}
                      style={{ color: "#BE3455", fontWeight: "bold" }}
                    >
                      {selectedAlbum?.artist.name}
                    </Link>
                  </Text>
                </View>
                <View>
                  <AlbumPlayButton />
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={{ marginVertical: 10 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  marginBottom: 15,
                }}
              >
                About
              </Text>
              <Text style={{ fontStyle: "italic", marginBottom: 20 }}>
                {formatUTCDate(selectedAlbum?.releaseDate)}
              </Text>
              <Text style={{ marginBottom: 20 }}>{selectedAlbum?.about}</Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {selectedAlbum.tags && tagPills}
              </View>
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
    backgroundColor: "white",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
  listContainer: {
    backgroundColor: "white",
    paddingHorizontal: "5%",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    justifyContent: "space-between",
    marginVertical: 5,
  },
  listHeader: {
    alignContent: "center",
  },
  text: {
    padding: 10,
    fontWeight: "bold",
  },
  image: {
    width: 380,
    height: 380,
    marginVertical: 10,
    backgroundColor: "#f0f0f0", // placeholder color while loading
    alignSelf: "center",
  },
  loadSpinner: {
    flex: 1,
  },
});
