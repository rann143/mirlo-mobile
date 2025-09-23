import { useAuthContext } from "@/state/AuthContext";
import { useRouter } from "expo-router";
import { Pressable, ViewProps, ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

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
    if (trackGroup.minPrice === 0 || trackGroup.minPrice === null) {
      router.push("/addFreeAlbumModal");
      return;
    }
    router.push("/emailPurchaseInfoModal");

    // if (!user) {
    //   router.push("/emailPurchaseInfoModal")
    // } else if (user && ) {
    //   console.log('free');
    //       //router.push(ADD TO COLLECTION)
    // } else {
    //       router.push("/emailPurchaseInfoModal")
    // }
  };

  return ids && ids.includes(trackGroup.id) ? null : (
    <Pressable onPress={onPress} style={style}>
      <Ionicons name="add-circle-outline" size={size} />
    </Pressable>
  );
}
