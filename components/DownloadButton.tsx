import Ionicons from "@expo/vector-icons/Ionicons";
import * as api from "../queries/fetch/fetchWrapper";
import { StyleSheet, View, Pressable } from "react-native";
import { File, Paths, Directory } from "expo-file-system";
import { unzip } from "react-native-zip-archive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useCallback, useState } from "react";
import { useAuthContext } from "@/state/AuthContext";
import { ActivityIndicator } from "react-native";

type DownloadButtonProps = {
  format: string;
  itemData: AlbumProps;
  prefix: string;
  size: number;
};

export default function DownloadButton({
  format,
  itemData,
  prefix,
  size,
}: DownloadButtonProps) {
  const { user } = useAuthContext();
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const checkDownload = async () => {
      const exists = await downloadExists(itemData);
      if (isMounted) {
        setDownloaded(exists);
      }
    };

    checkDownload();

    return () => {
      isMounted = false;
    };
  }, [itemData, downloading]);

  const ids: number[] | undefined = user?.userTrackGroupPurchases?.map(
    (purchase) => purchase.trackGroupId,
  );
  const onPress = useCallback(async () => {
    try {
      setDownloading(true);
      const storageKey = getAlbumStorageKey(itemData);
      const exists = await getAlbumData(storageKey);
      console.log("exists: " + exists);
      console.log(exists);

      if (exists) {
        console.log("album already downloaded");
        console.log("removing download");
        await AsyncStorage.removeItem(storageKey);
        await removeDownloadedKey(storageKey);

        const albumDir = new Directory(
          Paths.document,
          `offline-audio/${storageKey}`,
        );
        albumDir.delete();
        console.log("album deleted from storage");

        return;
      }

      const audioFolderPath = await downloadAudioZip(
        format,
        prefix,
        itemData.title,
        itemData.id,
      );
      console.log(audioFolderPath);
      await storeAlbumData(itemData);
    } catch (err) {
      console.log("Error on download button press: ", err);
    } finally {
      setDownloading(false);
    }
  }, [format, prefix, itemData]);

  return ids && !ids.includes(itemData.id) ? null : (
    <View>
      {downloading ? (
        <ActivityIndicator
          size="large"
          color="#BE3455"
          style={styles.loadSpinner}
        />
      ) : (
        <Pressable onPress={onPress}>
          <Ionicons
            name={downloaded ? "checkmark-done-circle" : "download-outline"}
            size={size}
          />
        </Pressable>
      )}
    </View>
  );
}

async function downloadExists(itemData: AlbumProps) {
  const storageKey = getAlbumStorageKey(itemData);
  const exists = await getAlbumData(storageKey);
  return exists ? true : false;
}

async function downloadAudioZip(
  format: string,
  prefix: string,
  audioFolderTitle: string,
  audioFolderId: number,
) {
  try {
    const res = (await api.generateDownload(
      `/v1/${prefix}/generate`,
      {},
      { format: format },
    )) as any;
    console.log(res);
    console.log(prefix);

    const downloadRes = await api.getBinary(
      `/v1/${prefix}/download?format=${format}`,
      {},
    );
    console.log("Downloaded zip size:", downloadRes.byteLength, "bytes");
    console.log(downloadRes);

    const uint8Array = new Uint8Array(downloadRes);

    const cleanTitle = audioFolderTitle
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const zipFile = new File(Paths.cache, `${cleanTitle}.zip`);
    console.log("Writing zip to:", zipFile.uri);
    try {
      // Try writing the file
      zipFile.write(uint8Array);
      console.log("File write completed successfully");
    } catch (writeError) {
      console.log("File write error:", writeError);
      throw new Error(`Failed to write zip file: ${writeError.message}`);
    }

    console.log(zipFile.uri);

    const extractDir = new Directory(Paths.document, "offline-audio");

    const albumStorageKey = getAlbumStorageKey({
      title: audioFolderTitle,
      id: audioFolderId,
    });

    // Convert file URI to path by removing 'file://' and decoding
    const zipPath = decodeURIComponent(zipFile.uri.replace("file://", ""));
    const extractPath =
      decodeURIComponent(Paths.document.uri.replace("file://", "")) +
      `offline-audio/${albumStorageKey}`;
    console.log(extractDir.uri);
    try {
      const extractresult = await unzip(zipPath, extractPath);
      console.log(`zip extracted to ${extractresult}`);
    } catch (err) {
      console.error("error unzipping: ", err);
    }

    zipFile.delete();

    return;
  } catch (err) {
    console.log("Download/zip error: ", err);
  }
}

async function storeAlbumData(albumData: AlbumProps) {
  try {
    const albumPathName = getAlbumStorageKey(albumData);
    const albumDir = new Directory(
      Paths.document,
      `offline-audio/${albumPathName}`,
    );

    if (!albumDir.exists) {
      throw new Error(`album ${albumPathName} doesnt exist`);
    }

    const files = albumDir.list();

    const audioFiles = files.filter((file) => {
      return file.name.match(/\.mp3$/i);
    });

    const downloadedTracks = albumData.tracks?.map((track) => {
      const downloadedAudioFile = audioFiles.find((file) => {
        return file.name.includes(track.title);
      });

      const updatedTrack = {
        ...track,
        audio: { ...track.audio, url: downloadedAudioFile?.uri },
      };

      return updatedTrack;
    }) as RNTrack[];

    albumData.tracks = downloadedTracks;

    const finalizedData = {
      trackGroup: albumData,
      trackGroupId: albumData.id,
    };

    const stringifiedData = JSON.stringify(finalizedData);

    const storageKey = getAlbumStorageKey(albumData);
    await AsyncStorage.setItem(storageKey, stringifiedData);
    await storeDownloadedKey(storageKey);
  } catch (err) {
    console.error("Error storing Album data: ", err);
  }
}

async function getAlbumData(albumStored: string) {
  // albumStored looks like: `${album.title}-${album.id}`
  try {
    const albumData = await AsyncStorage.getItem(albumStored);

    if (albumData) {
      const jsonAlbumData = JSON.parse(albumData);
      return jsonAlbumData;
    }

    console.log(`No data stored under ${albumStored}`);
    return undefined;
  } catch (err) {
    console.log("Error getting stored Album data: ", err);
  }
}

async function storeDownloadedKey(key: string) {
  const downloadedKeys = await AsyncStorage.getItem("downloadedKeys");

  const keys: string[] = downloadedKeys ? JSON.parse(downloadedKeys) : [];

  if (!keys.includes(key)) {
    keys.push(key);
  }

  await AsyncStorage.setItem("downloadedKeys", JSON.stringify(keys));
}

async function removeDownloadedKey(key: string) {
  const downloadedKeys = await AsyncStorage.getItem("downloadedKeys");

  const keys: string[] = downloadedKeys ? JSON.parse(downloadedKeys) : [];

  if (!keys.includes(key)) {
    console.log("key doesn't exist in list of downloadedKeys");
    return;
  }

  const updatedKeys = keys.filter((key) => key !== key);

  await AsyncStorage.setItem("downloadedKeys", JSON.stringify(updatedKeys));
}

function getAlbumStorageKey(album: { title: string; id: string | number }) {
  const cleanTitle = album.title
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return `${cleanTitle}-${album.id}`;
}

const styles = StyleSheet.create({
  loadSpinner: {
    flex: 1,
  },
});
