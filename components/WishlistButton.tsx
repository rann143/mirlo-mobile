import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useState } from "react";
import { useAuthContext } from "@/state/AuthContext";
import { useTranslation } from "react-i18next";
import * as api from "../queries/fetch/fetchWrapper";
import { useAppIsReadyContext } from "@/state/AppReadyContext";
import { ViewProps } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

type WishlistButton = {
  trackGroup: {
    id: number;
  };
  style?: ViewProps;
  size?: number;
};

export default function WishlistButton({
  trackGroup,
  style,
  size,
}: WishlistButton) {
  const { user, refreshLoggedInUser } = useAuthContext();
  const queryClient = useQueryClient();
  const [isInWishlist, setIsInWishlist] = useState(
    !!user?.wishlist?.find((w) => w.trackGroupId === trackGroup.id)
  );

  if (!user) {
    return null;
  }

  const onPress = useCallback(async () => {
    await api.post(`/v1/trackGroups/${trackGroup.id}/wishlist`, {
      wishlist: !isInWishlist,
    });
    setIsInWishlist((val) => !val);
    queryClient.invalidateQueries({
      queryKey: ["fetchWishlist", { userId: user.id }],
    });
    refreshLoggedInUser();
  }, [isInWishlist, trackGroup.id]);

  return (
    <Pressable onPress={onPress} style={style}>
      <Ionicons
        name={isInWishlist ? "heart" : "heart-outline"}
        color={"#BE3455"}
        size={size}
      />
    </Pressable>
  );
}
