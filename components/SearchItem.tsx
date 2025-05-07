import { View, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

type Result = {
  result: {
    id: number | string;
    name: string;
    category?: string;
    artistId?: number | string;
    trackGroupId?: number | string;
  };
  index: number;
};

export default function SearchItem({ result, index }: Result) {
  const router = useRouter();
  return (
    <View style={{ margin: 10 }}>
      <Pressable
        onPress={() => {
          router.navigate(constructUrl(result));
        }}
      >
        <View>
          <Text style={{ fontSize: 25 }}>{result.name}</Text>
          <Text style={{ fontSize: 15, color: "grey" }}>{result.category}</Text>
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
