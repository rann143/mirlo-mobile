import {
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  View,
  TextInput,
  Button,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { debounce } from "lodash";
import * as api from "../queries/fetch/fetchWrapper";
import AutoComplete from "./AutoComplete";
import { useNavigation, Link } from "expo-router";

export default function SearchBar() {
  const {
    control,
    formState: { errors },
  } = useForm();
  const { height } = useWindowDimensions();
  async function getOptions(searchString: string) {
    const artists = await api.getMany<Artist>(
      `/v1/artists`,
      {},
      { name: searchString }
    );
    const trackGroups = await api.getMany<AlbumProps>(
      `/v1/trackGroups`,
      {},
      { title: searchString }
    );
    const tracks = await api.getMany<RNTrack>(
      `/v1/tracks`,
      {},
      { title: searchString }
    );
    const results = [
      ...artists.results.map((r, rid) => ({
        firstInCategory: rid === 0,
        category: "artists",
        artistId: r.urlSlug ?? r.id,
        id: r.id,
        name: r.name,
        isArtist: true,
      })),
      ...trackGroups.results.map((tr, trid) => ({
        firstInCategory: trid === 0,
        category: "albums",
        id: tr.urlSlug ?? tr.id,
        artistId: tr.artist?.urlSlug ?? tr.artistId,
        trackGroupId: tr.urlSlug ?? tr.id,
        name: tr.title,
        isTrackGroup: true,
      })),
      ...tracks.results.map((tr, trid) => ({
        firstInCategory: trid === 0,
        id: tr.id,
        category: "tracks",
        trackGroupId: tr.trackGroup.urlSlug ?? tr.trackGroupId,
        artistId: tr.trackGroup.artist.urlSlug ?? tr.trackGroup.artistId,
        name: tr.title,
        isTrack: true,
      })),
    ];

    return results;
  }

  return (
    <AutoComplete
      getOptions={getOptions}
      onSelect={(searchValue) => console.log(`Going to: ${searchValue}`)}
      optionDisplay={(
        result: {
          id: number | string;
          name: string;
          artistId?: number | string;
          trackGroupId?: number | string;
        },
        index: number
      ) => {
        return (
          <Link href="/" key={index}>
            {result.name}
          </Link>
        );
      }}
    />
  );
}
// contructUrl won't work here (it's from the webapp).
// Need to refactor for expo router to determine which screen to go to
const constructUrl = (r: any) => {
  let url = "";

  if (r.artistId) {
    url += r.artistId;

    if (r.trackGroupId) {
      url += `/release/${r.trackGroupId}`;

      if (r.id !== r.trackGroupId) {
        url += `tracks/${r.id}`;
      }
    }
  }
};
