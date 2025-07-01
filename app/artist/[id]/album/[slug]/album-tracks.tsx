import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {
  useLocalSearchParams,
  useRouter,
  Link,
  useFocusEffect,
} from "expo-router";
import { usePlayer } from "@/state/PlayerContext";
import { isTrackOwnedOrPreview } from "@/scripts/utils";
import { useAuthContext } from "@/state/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { queryAlbum } from "@/queries/queries";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { API_ROOT } from "@/constants/api-root";
import { API_KEY } from "@/constants/api-key";
import TrackPlayer, { PlaybackState, State } from "react-native-track-player";
import Ionicons from "@expo/vector-icons/Ionicons";
import PlayPauseWrapper from "@/components/PlayPauseWrapper";
import { useTranslation } from "react-i18next";

type DateTimeFormatOptions = Intl.DateTimeFormatOptions;

function AlbumPlayButton() {
  const {
    playbackState,
    isPlaying,
    activeTrack,
    playableTracks,
    setActiveTrack,
    setShuffled,
  } = usePlayer();
  const [q, setQ] = useState<RNTrack[]>([]);

  useEffect(() => {
    async function getQ() {
      try {
        const queue = (await TrackPlayer.getQueue()) as RNTrack[];
        setQ(queue);
      } catch (error) {
        console.error("Error getting queue:", error);
      }
    }
    getQ();
  }, []);

  const togglePlayBack = useCallback(async () => {
    try {
      const queue = await TrackPlayer.getQueue();

      // Set queue if no queue currently set or if the queue is empty
      if (!queue || queue.length === 0) {
        await TrackPlayer.setQueue(playableTracks);
        await TrackPlayer.play();
        const current = (await TrackPlayer.getActiveTrack()) as RNTrack;
        setActiveTrack(current);
        return;
      }

      const currentTrack = await TrackPlayer.getActiveTrack();

      // Check if the current album in the player is the same as the album for playableTracks
      const isSameAlbum =
        currentTrack?.trackGroup?.urlSlug ===
          playableTracks[0]?.trackGroup?.urlSlug &&
        playableTracks.length === queue.length; // More robust check

      // Song Change to different album
      if (!isSameAlbum) {
        try {
          setShuffled(false);
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

      // If it's the same album, toggle play/pause
      if (
        playbackState.state === State.Paused ||
        playbackState.state === State.Ready
      ) {
        await TrackPlayer.play();
        return;
      } else if (
        playbackState.state === State.Playing ||
        playbackState.state === State.Buffering
      ) {
        await TrackPlayer.pause();
        return;
      } else {
        console.error(`playback state: ${playbackState.state} not expected`);
      }
    } catch (err) {
      console.error("issue with playback", err);
    }
  }, [isPlaying, playableTracks, setActiveTrack]);

  return (
    <TouchableOpacity
      onPress={togglePlayBack}
      disabled={playableTracks.length ? false : true}
    >
      <Ionicons
        name={
          playableTracks.length
            ? (isPlaying || playbackState.state == State.Buffering) &&
              activeTrack?.trackGroup?.urlSlug ===
                playableTracks[0].trackGroup?.urlSlug &&
              playableTracks.length === q?.length
              ? "pause-circle-outline"
              : "play-circle-outline"
            : "play-circle-outline"
        }
        size={70}
        style={{ marginHorizontal: 5 }}
        color={playableTracks.length ? "black" : "lightgrey"}
      />
    </TouchableOpacity>
  );
}

const MemoizedAlbumPlayButton = React.memo(AlbumPlayButton);

function formatUTCDate(utcDate: string | undefined) {
  const { t } = useTranslation("translation");
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
    ? `${t("trackGroupCard.releaseDate")} ${result}`
    : t("trackGroupCard.released").substring(
        0,
        t("trackGroupCard.released").indexOf(":") + 1
      ) + ` ${result}`;
}

export default function AlbumTracks() {
  const { id, slug } = useLocalSearchParams();
  const { isPending, isError, data, error } = useQuery(
    queryAlbum({ slug: slug, id: id })
  );
  const router = useRouter();
  const { setPlayableTracks } = usePlayer();
  const { user } = useAuthContext();
  const [album, setAlbum] = useState<RNTrack[]>();
  const { t } = useTranslation("translation");

  useFocusEffect(
    useCallback(() => {
      const tracksToPlay: RNTrack[] = [];
      const allTracks: RNTrack[] = [];
      let playableIndex = 0;

      if (data && data.result.tracks) {
        data.result.tracks.forEach((track) => {
          const newTrack: RNTrack = {
            title: track.title,
            artist: data.result.artist.name,
            artwork: data.result.cover.sizes[600],
            url: `${API_ROOT}${track.audio.url}`,
            id: data.result.id,
            trackArtists: track.trackArtists,
            queueIndex: track.order,
            trackGroupId: data.result.trackGroupId,
            trackGroup: {
              userTrackGroupPurchases: data.result.userTrackGroupPurchases,
              artistId: data.result.artistId,
              urlSlug: data.result.urlSlug,
              cover: data.result.cover,
              title: data.result.title,
              artist: data.result.artist,
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

          if (isTrackOwnedOrPreview(newTrack, user, data.result)) {
            newTrack.queueIndex = playableIndex;
            playableIndex++;
            tracksToPlay.push(newTrack);
          }
        });
      }

      setAlbum(allTracks);
      setPlayableTracks(tracksToPlay);
    }, [data])
  );

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

  const tagPills = selectedAlbum.tags?.map((tagName, index) => {
    return (
      <Link
        key={index}
        href={{
          pathname: "/tags/[tag]",
          params: { tag: tagName },
        }}
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
        {tagName}
      </Link>
    );
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          keyExtractor={(item, index) => `${index}-${item.id || item.title}`}
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
                <View style={{ maxWidth: "75%" }}>
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
                  <MemoizedAlbumPlayButton />
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
                {t("trackGroupDetails.about")}
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
