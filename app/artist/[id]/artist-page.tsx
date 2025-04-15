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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

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
        <Image
          style={styles.image}
          source={{
            uri: artistInfo?.avatar?.sizes?.[600] || "",
          }}
          resizeMode="cover"
        />
        <Text style={{ color: "black" }}>Hello, {data.name}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
