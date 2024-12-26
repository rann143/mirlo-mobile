import { View, Text, StyleSheet } from "react-native";

export default function Collections() {
  return (
    <View style={styles.container}>
      <Text>My Collections</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
