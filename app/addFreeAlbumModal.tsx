import DismissModalBar from "@/components/DismissModalBar";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mirloRed } from "@/constants/mirlo-red";

export default function addFreeAlbumModal() {
  return (
    <SafeAreaView style={styles.container}>
      <DismissModalBar />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 50,
          width: "100%",
          backgroundColor: mirloRed,
        }}
      >
        <Pressable
          onPress={() => {
            console.log("IMPLEMENT: ADD FREE ALBUM TO COLLECTION");
          }}
          style={{
            alignItems: "center",
            marginBottom: 10,
            backgroundColor: "white",
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "black",
              margin: 10,
              textAlign: "center",
            }}
          >
            Add Free Album to Collection
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
