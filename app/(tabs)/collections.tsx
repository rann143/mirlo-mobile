import { View, Text, StyleSheet } from "react-native";
import { useAuthContext } from "@/state/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { API_ROOT } from "@/constants/api-root";
import { Link, Redirect } from "expo-router";
import ProfileLink from "@/components/ProfileLink";

export default function Collections() {
  const { user } = useAuthContext();
  const userId = user?.id;

  const [purchases, setPurchases] = useState<UserTrackGroupPurchase[]>();

  const fetchTrackGroups = useCallback(async () => {
    const { results } = await fetch(
      `${API_ROOT}/v1/users/${userId}/purchases`
    ).then((response) => response.json());
    setPurchases(results);
  }, [userId]);

  useEffect(() => {
    fetchTrackGroups();
  }, [fetchTrackGroups]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Login to see your collection</Text>
        <ProfileLink />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>My Collection</Text>
      {purchases?.map(
        (purchase) =>
          purchase.trackGroup && (
            <Text key={purchase.trackGroupId}>{purchase.trackGroup.title}</Text>
          )
      )}
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
