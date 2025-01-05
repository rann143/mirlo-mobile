import { View, Text, StyleSheet } from "react-native";
import { useAuthContext } from "@/state/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { API_ROOT } from "@/constants/api-root";
import { Link, Redirect } from "expo-router";
import ProfileLink from "@/components/ProfileLink";
import { useQuery } from "@tanstack/react-query";

import { queryUserPurchases } from "@/queries/queries";

export default function Collections() {
  const { user } = useAuthContext();
  const userId = user?.id;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Login to see your collection</Text>
        <ProfileLink />
      </View>
    );
  }

  const { isPending, isError, data, error } = useQuery(
    queryUserPurchases(userId)
  );
  const purchases = data?.results;

  // const [purchases, setPurchases] = useState<UserTrackGroupPurchase[]>();

  // const fetchTrackGroups = useCallback(async () => {
  //   const { results } = await fetch(`${API_ROOT}/v1/users/${userId}/purchases`)
  //     .then((response) => response.json())
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  //   setPurchases(results);
  // }, [userId]);

  // useEffect(() => {
  //   if (userId) {
  //     fetchTrackGroups();
  //   }
  // }, [fetchTrackGroups]);

  if (isPending) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  if (!purchases) {
    return <Text>No purchases found</Text>;
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
