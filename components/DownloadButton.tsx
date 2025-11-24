import Ionicons from "@expo/vector-icons/Ionicons";
import * as api from "../queries/fetch/fetchWrapper";
import { View, Pressable } from "react-native";
import { File, Paths, Directory } from "expo-file-system";
import { unzip } from "react-native-zip-archive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";
import { useAuthContext } from "@/state/AuthContext";

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

  const ids: number[] | undefined = user?.userTrackGroupPurchases?.map(
    (purchase) => purchase.trackGroupId,
  );
  const onPress = useCallback(async () => {
    try {
      const cleanTitle = itemData.title
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const exists = await getAlbumData(`${itemData.title}-${itemData.id}`);
      console.log("exists: " + exists);
      console.log(exists);

      if (exists) {
        console.log("album already downloaded");
        console.log("removing download");
        await AsyncStorage.removeItem(`${itemData.title}-${itemData.id}`);
        const albumDir = new Directory(
          Paths.document,
          `offline-audio/${cleanTitle}_${itemData.id}`,
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
    }
  }, [format, prefix, itemData]);

  return ids && !ids.includes(itemData.id) ? null : (
    <View>
      <Pressable onPress={onPress}>
        <Ionicons name="download-outline" size={size} />
      </Pressable>
    </View>
  );
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

    // Convert file URI to path by removing 'file://' and decoding
    const zipPath = decodeURIComponent(zipFile.uri.replace("file://", ""));
    const extractPath =
      decodeURIComponent(Paths.document.uri.replace("file://", "")) +
      `offline-audio/${cleanTitle}_${audioFolderId}`;
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
    const cleanTitle = albumData.title
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const albumDir = new Directory(
      Paths.document,
      `offline-audio/${cleanTitle}_${albumData.id}`,
    );

    if (!albumDir.exists) {
      throw new Error(`album ${albumData.title}_${albumData.id} doesnt exist`);
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

    const stringifiedData = JSON.stringify(albumData);
    await AsyncStorage.setItem(
      `${albumData.title}-${albumData.id}`,
      stringifiedData,
    );
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
