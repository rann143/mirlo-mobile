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
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <SafeAreaView>
      <Animated.View
        style={[
          styles.errorNotification,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
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
              {" "}
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
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorNotification: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
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
    fontSize: 14,
    marginBottom: 2,
  },
  errorMessage: {
    color: "white",
    fontSize: 12,
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
