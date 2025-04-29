import { useQuery } from "@tanstack/react-query";
import { queryArtist } from "@/queries/queries";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Markdown from "react-native-markdown-display";

const { width } = Dimensions.get("window");
const itemWidth = (width - 100) / 2;

export default function ArtistPage() {
  const { id } = useLocalSearchParams();
  const { data, isError, isPending, error } = useQuery(
    queryArtist({ artistSlug: String(id) ?? "" })
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

  const artistInfo = data;

  const artistAlbums = artistInfo.trackGroups?.map((album) => {
    return (
      <View key={album.id} style={styles.albumItem}>
        <Image
          style={{ width: "100%", height: itemWidth }}
          source={{
            uri: album.cover.sizes[600],
          }}
        />
        <Text style={styles.albumTitle}>{album.title}</Text>
      </View>
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
        {artistInfo.banner && (
          <Image
            style={styles.image}
            source={{
              uri: artistInfo?.banner?.sizes?.[625] || "",
            }}
            resizeMode="cover"
          />
        )}

        <View>
          <View style={styles.introBanner}>
            {artistInfo.avatar && (
              <Image
                style={styles.avatar}
                source={{
                  uri: artistInfo?.avatar?.sizes?.[600] || "",
                }}
                resizeMode="cover"
              />
            )}
            <View style={{ marginHorizontal: 20, gap: 5 }}>
              <Text style={{ color: "black", fontWeight: "bold" }}>
                {data.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={"#b5b5b5"}
                ></Ionicons>
                <Text style={{ color: "#b5b5b5" }}>{data.location}</Text>
              </View>
            </View>
          </View>
          <ScrollView>
            <View style={styles.grid}>{artistAlbums}</View>
          </ScrollView>
          <View style={{ gap: 10, margin: 20 }}>
            <Text style={{ fontWeight: "bold" }}>About</Text>
            <Text>
              {artistInfo.bio
                ? artistInfo.bio.replace(/([^\n])\n([^\n])/g, "$1 $2")
                : artistInfo.name + " is an artist on Mirlo"}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: "50%",
    width: 50,
    height: 50,
  },
  introBanner: {
    flexDirection: "row",
    margin: 20,
    backgroundColor: "white",
    alignItems: "center",
  },
  loadSpinner: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  image: {
    width: "100%",
    height: "30%",
    backgroundColor: "#f0f0f0", // placeholder color while loading
    alignSelf: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  albumItem: {
    width: itemWidth,
    marginBottom: 20,
    alignItems: "center",
  },
  albumTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "300",
  },
});
