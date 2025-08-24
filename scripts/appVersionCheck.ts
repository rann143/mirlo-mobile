import * as Application from "expo-application";
import { Alert, Linking, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function checkForUpdates() {
  try {
    const currentVersion = Application.nativeBuildVersion;
    const bundleId = Application.applicationId;

    if (!currentVersion || bundleId) {
      console.log("couldn't get current version or bundleId");
      return false;
    }

    console.log(`Checking for updates. Current version: ${currentVersion}`);

    let storeVersion, storeUrl;

    if (Platform.OS === "ios") {
      const result = await checkiOSVersion(bundleId);
      storeVersion = result.version;
      storeUrl = result.url;
    } else if (Platform.OS === "android") {
      throw new Error("Version check for Android not yet implemented");
      //const result = await checkAndroidVersion(bundleId);
      // storeVersion = result.version;
      // storeUrl = result.url;
    } else {
      console.log("Platform not supported for version checking");
      return false;
    }

    if (!storeVersion) {
      console.log("Could not fetch store version");
      return false;
    }

    console.log(`Store version: ${storeVersion}`);

    // Compare versions
    if (isVersionGreater(storeVersion, currentVersion)) {
      showForceUpdateAlert(currentVersion, storeVersion, storeUrl);
      return true;
    } else {
      console.log("App is up to date");
    }

    return false;
  } catch (err) {
    console.error("Version check failed", err);
    return false;
  }
}

async function checkiOSVersion(bundleId: string | null) {
  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?bundleId=${bundleId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const appData = data.results[0];
      return {
        version: appData.version,
        url: appData.trackViewUrl,
        releaseNotes: appData.releaseNotes,
        releaseDate: appData.currentVersionReleaseDate,
      };
    } else {
      throw new Error("App not found in App Store");
    }
  } catch (error) {
    console.log("iOS version check failed:", error);
    return { version: null, url: null };
  }
}

// function checkAndroidVersion(bundleId: string | null) {
//     throw new Error("Function not implemented.");
// }
function showForceUpdateAlert(
  currentVersion: string | null,
  newVersion: string,
  storeUrl: string
) {
  Alert.alert(
    "Update Required",
    `This version (${currentVersion}) is no longer supported. Please update to version ${newVersion} to continue using the app.`,
    [
      {
        text: "Update Now",
        onPress: () => Linking.openURL(storeUrl),
      },
    ],
    {
      cancelable: false,
      onDismiss: () => {
        // Re-show alert if dismissed
        setTimeout(
          () => showForceUpdateAlert(currentVersion, newVersion, storeUrl),
          1000
        );
      },
    }
  );
}

// Version comparison helper
function compareVersions(version1: string, version2: string) {
  // Clean versions (remove any non-numeric characters except dots)
  const v1 = version1
    .replace(/[^\d.]/g, "")
    .split(".")
    .map(Number);
  const v2 = version2
    .replace(/[^\d.]/g, "")
    .split(".")
    .map(Number);

  // Pad arrays to same length
  const maxLength = Math.max(v1.length, v2.length);
  while (v1.length < maxLength) v1.push(0);
  while (v2.length < maxLength) v2.push(0);

  // Compare each part
  for (let i = 0; i < maxLength; i++) {
    if (v1[i] > v2[i]) return 1;
    if (v1[i] < v2[i]) return -1;
  }
  return 0; // Equal
}

// Helper functions
function isVersionGreater(version1: string, version2: string) {
  return compareVersions(version1, version2) > 0;
}
