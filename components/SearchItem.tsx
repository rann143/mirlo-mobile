import { View, Pressable, Text, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSearch } from "@/state/SearchContext";
import { toUpper } from "lodash";

type Result = {
  result: {
    id: number | string;
    name: string;
    category?: string;
    artistId?: number | string;
    trackGroupId?: number | string;
    artistName?: string;
    avatar?: {
      url: string;
      sizes?: { [key: string]: string };
      updatedAt: string;
    };
    trackGroupCover?: {
      sizes: {
        60: string;
        120: string;
        300: string;
        600: string;
        960: string;
        1200: string;
        1500: string;
      };
    };
  };
  index: number;
};

export default function SearchItem({ result, index }: Result) {
  const router = useRouter();
  const { setSearchResults, setShowSuggestions } = useSearch();
  return (
    <View style={{ marginVertical: 5 }}>
      <Pressable
        onPress={() => {
          setSearchResults([]);
          setShowSuggestions(false);
          router.back();
          router.navigate(constructUrl(result));
        }}
      >
        <View style={styles.listItem}>
          <Image
            source={
              result.trackGroupCover?.sizes?.[120]
                ? { uri: result.trackGroupCover.sizes[120] }
                : result.avatar?.sizes?.[120]
                ? { uri: result.avatar.sizes[120] }
                : require("@/assets/images/mirlo-logo-logoOnly-light.png")
            }
            style={styles.image}
          />
          <View style={{ marginLeft: 15, width: 300, gap: 2 }}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{ fontSize: 18 }}
            >
              {result.name}
            </Text>
            {result.artistName && (
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{ fontSize: 15, color: "grey" }}
              >
                By {result.artistName}
              </Text>
            )}
            <Text style={{ fontSize: 12, color: "grey" }}>
              {toUpper(result.category)}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
const constructUrl = (r: any) => {
  if (!r || !r.artistId) {
    return "/";
  }

  if (r.trackGroupId) {
    return `/artist/${r.artistId}/album/${r.trackGroupId}/album-tracks` as const; // as const tells typescript this is a literal string pattern
  } else {
    return `/artist/${r.artistId}/artist-page` as const;
  }
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 1,
    backgroundColor: "white", // placeholder color while loading
  },
});
