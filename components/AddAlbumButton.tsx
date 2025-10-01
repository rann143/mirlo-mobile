import { useAuthContext } from "@/state/AuthContext";
import { useFocusEffect, useRouter } from "expo-router";
import { Pressable, ViewProps, ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useState } from "react";

type AddAlbumButtonProps = {
  trackGroup: AlbumProps;
  style?: ViewStyle;
  size?: number;
};

export default function AddAlbumButton({
  style,
  size,
  trackGroup,
}: AddAlbumButtonProps) {
  const { user } = useAuthContext();
  const router = useRouter();

  const ids: number[] | undefined = user?.userTrackGroupPurchases?.map(
    (purchase) => purchase.trackGroupId
  );

  const onPress = () => {
    if (!user) {
      router.push({
        pathname: "/emailVerificationModal",
        params: {
          accessing: "Purchase Info",
          trackGroupTitle: trackGroup.title,
          trackGroupId: trackGroup.id,
          artist: trackGroup.artist.name,
        },
      });
    } else if (
      user &&
      (trackGroup.minPrice === 0 || trackGroup.minPrice === null)
    ) {
      router.push({
        pathname: "/addFreeAlbumModal",
        params: {
          trackGroupTitle: trackGroup.title,
          trackGroupId: trackGroup.id,
        },
      });
      return;
    } else {
      router.push({
        pathname: "/emailPurchaseInfoModal",
        params: {
          trackGroupTitle: trackGroup.title,
          trackGroupId: trackGroup.id,
          artist: trackGroup.artist.name,
        },
      });
    }
  };

  return ids && ids.includes(trackGroup.id) ? null : (
    <Pressable onPress={onPress} style={style}>
      <Ionicons name="add-circle-outline" size={size} />
    </Pressable>
  );
}
