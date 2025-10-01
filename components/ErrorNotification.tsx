import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
} from "react-native";

type ErrorNotificationProps = {
  onDismiss: () => void;
  visible: boolean;
  error: Error;
};

const ErrorNotification = ({
  onDismiss,
  visible = true,
  error,
}: ErrorNotificationProps) => {
  if (!visible) return null;

  return (
    <SafeAreaView>
      <View style={[styles.errorNotification]}>
        <View style={styles.errorIcon}>
          <Text style={styles.iconText}>⚠️</Text>
        </View>
        <View style={styles.errorContent}>
          {error.message === "Network request failed" ? (
            <View>
              <Text style={styles.errorTitle}>Connection Issue</Text>
              <Text style={styles.errorMessage}>
                Unable to connect. Check your internet and try again.
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.errorTitle}>{error.name}</Text>
              <Text style={styles.errorMessage}>{error.message}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.dismissBtn}
          onPress={onDismiss}
          activeOpacity={0.7}
        >
          <Text style={styles.dismissText}>×</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorNotification: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#ff6b6b",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    width: "80%",
    gap: 5,
  },
  errorIcon: {
    width: 24,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 14,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 2,
  },
  errorMessage: {
    color: "white",
    fontSize: 15,
    opacity: 0.9,
    lineHeight: 16,
  },
  dismissBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ErrorNotification;

// Usage example:
/*
import React from 'react';
import { View } from 'react-native';
import ErrorNotification from './ErrorNotification';

const App: React.FC = () => {
  const [showError, setShowError] = React.useState<boolean>(true);

  return (
    <View style={{ flex: 1 }}>
      <ErrorNotification 
        visible={showError}
        onDismiss={() => setShowError(false)}
      />
      {/* Rest of your app content */
//</View>
//);
//};
