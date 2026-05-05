import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import DismissModalBar from "@/components/DismissModalBar";
import { mirloRed } from "@/constants/mirlo-red";
import {
  AUTH_PROFILE_QUERY_KEY,
  clearLocalAuthSession,
} from "@/queries/authQueries";
import * as api from "@/queries/fetch/fetchWrapper";
import { useAuthContext } from "@/state/AuthContext";

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { user, refreshLoggedInUser } = useAuthContext();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const artistCount = user?.artists?.length ?? 0;
  const albumPurchaseCount = user?.userTrackGroupPurchases?.length ?? 0;
  const trackPurchaseCount = user?.userTrackPurchases?.length ?? 0;
  const merchPurchaseCount = user?.merchPurchase?.length ?? 0;
  const subscriptionCount = user?.artistUserSubscriptions?.length ?? 0;

  const warningItems = useMemo(() => {
    const items = [
      "This permanently deletes your Mirlo account and logs you out of the app.",
    ];

    if (artistCount > 0) {
      items.push(
        `This account has ${artistCount} artist ${artistCount === 1 ? "profile" : "profiles"}.`,
      );
    }

    if (subscriptionCount > 0) {
      items.push(
        `This account has ${subscriptionCount} active artist ${subscriptionCount === 1 ? "subscription" : "subscriptions"}.`,
      );
    }

    if (albumPurchaseCount > 0 || trackPurchaseCount > 0) {
      const totalMusicPurchases = albumPurchaseCount + trackPurchaseCount;
      items.push(
        `This account has ${totalMusicPurchases} music ${totalMusicPurchases === 1 ? "purchase" : "purchases"}.`,
      );
    }

    if (merchPurchaseCount > 0) {
      items.push(
        `This account has ${merchPurchaseCount} merch ${merchPurchaseCount === 1 ? "purchase" : "purchases"}.`,
      );
    }

    items.push("This action cannot be undone.");

    return items;
  }, [
    albumPurchaseCount,
    artistCount,
    merchPurchaseCount,
    subscriptionCount,
    trackPurchaseCount,
  ]);

  const deleteAccount = useCallback(async () => {
    if (!user?.id || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await api.del(`/v1/users/${user.id}`);
      await clearLocalAuthSession();
      queryClient.setQueryData(AUTH_PROFILE_QUERY_KEY, null);
      refreshLoggedInUser();
      router.dismissTo("/");
    } catch (err) {
      console.error("failed to delete account", err);
      Alert.alert("Couldn't delete account", "Please try again in a moment.");
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, queryClient, refreshLoggedInUser, router, user?.id]);

  const confirmDelete = useCallback(() => {
    if (!user?.id || isDeleting) {
      return;
    }

    Alert.alert(
      "Delete account?",
      "This permanently deletes your Mirlo account. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete account",
          style: "destructive",
          onPress: () => {
            deleteAccount();
          },
        },
      ],
    );
  }, [deleteAccount, isDeleting, user?.id]);

  return (
    <SafeAreaView style={styles.container}>
      <DismissModalBar />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Delete account</Text>
          <Text style={styles.subtitle}>
            Review the impact below. You'll get a confirmation popup before the
            account is permanently deleted.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What happens next</Text>
          {warningItems.map((item) => (
            <View key={item} style={styles.warningRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.warningText}>{item}</Text>
            </View>
          ))}
        </View>

        {(() => {
          const musicPurchaseCount = albumPurchaseCount + trackPurchaseCount;
          const summaryRows = [
            artistCount > 0 && `Artist profiles: ${artistCount}`,
            subscriptionCount > 0 &&
              `Artist subscriptions: ${subscriptionCount}`,
            musicPurchaseCount > 0 && `Music purchases: ${musicPurchaseCount}`,
            merchPurchaseCount > 0 && `Merch purchases: ${merchPurchaseCount}`,
          ].filter(Boolean) as string[];

          if (summaryRows.length === 0) return null;

          return (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Account summary</Text>
              {summaryRows.map((row) => (
                <Text key={row} style={styles.summaryText}>
                  {row}
                </Text>
              ))}
            </View>
          );
        })()}

        <Pressable
          onPress={confirmDelete}
          style={[styles.deleteButton, isDeleting && styles.disabledButton]}
          disabled={isDeleting || !user}
        >
          {isDeleting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.deleteButtonText}>Delete account</Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => router.dismiss()}
          style={styles.cancelButton}
          disabled={isDeleting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 18,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#555",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0d3d9",
    backgroundColor: "#fff7f8",
    padding: 18,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  warningRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  bullet: {
    fontSize: 18,
    lineHeight: 24,
    color: mirloRed,
  },
  warningText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fafafa",
    padding: 18,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  summaryText: {
    fontSize: 16,
    color: "#444",
  },
  deleteButton: {
    backgroundColor: "#a21d1d",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  cancelButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d8d8d8",
    backgroundColor: "white",
  },
  cancelButtonText: {
    color: "#222",
    fontSize: 17,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
