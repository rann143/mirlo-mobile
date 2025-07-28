import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "@/state/AuthContext";
import { useTranslation } from "react-i18next";
import * as api from "../queries/fetch/fetchWrapper";
import { ViewProps } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

type FavoriteTrackButton = {
  track: {
    id: number;
  };
  style?: ViewProps;
  size?: number;
};

export default function FavoriteTrackButton({
  track,
  style,
  size,
}: FavoriteTrackButton) {
  const { user, refreshLoggedInUser } = useAuthContext();
  const [isInFavorites, setIsInFavorites] = useState(
    !!user?.trackFavorites?.find((w) => w.trackId === track.id)
  );

  if (!user) {
    return null;
  }

  const onPress = useCallback(async () => {
    await api.post(`/v1/tracks/${track.id}/favorite`, {
      favorite: !isInFavorites,
    });
    setIsInFavorites((val) => !val);
    refreshLoggedInUser();
  }, [isInFavorites, track.id]);

  return (
    <Pressable onPress={onPress} style={style}>
      <Ionicons
        name={isInFavorites ? "star" : "star-outline"}
        color={"#BE3455"}
        size={size}
      />
    </Pressable>
  );
}
