import Ionicons from "@expo/vector-icons/Ionicons";
import * as api from "../queries/fetch/fetchWrapper";
import { View } from "react-native";
import { File, Paths, Directory } from "expo-file-system";
import { unzip } from "react-native-zip-archive";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DownloadButton() {
  return <View></View>;
}

async function downloadAudioZip(
  format: string,
  prefix: string,
  audioFolderTitle: string,
  audioFolderId: number
) {
  try {
    const res = (await api.generateDownload(
      `/v1/${prefix}/generate`,
      {},
      { format: format },
    )) as any;
    console.log(res);

    const downloadRes = await api.get(
      `/v1/${prefix}/download?format=${format}`,
      {},
    ) as Response;
    console.log(downloadRes);

    const zipFile = new File(Paths.cache, `${audioFolderTitle}.zip`);
    zipFile.write(await downloadRes.bytes())

    const extractDir = `${Paths.document}/offline-audio/${audioFolderTitle}_${audioFolderId}`;

    const extractPath = await unzip(zipFile.uri, extractDir, 'UTF-8')
    console.log(`zip extracted to ${extractPath}`)

    zipFile.delete()

    return extractPath;
  

  } catch (err) {
    console.log("Download/zip error: ", err);
  }
}


async function storeAlbumData(albumData: AlbumProps) {

  try {

  const albumDir = new Directory(Paths.document, `offline-audio/${albumData.title}_${albumData.id}`)


  if (!(albumDir.exists)) {
    throw new Error(`album ${albumData.title}_${albumData.id} doesnt exist`)
  }

  const files = albumDir.list();

  const audioFiles = files.filter((file) => {
    return file.name.match(/\.mp3$/i)
  })
  
  const downloadedTracks = albumData.tracks?.map((track) => {
    
    const downloadedAudioFile = audioFiles.find((file) => {
      return file.name.includes(track.title)
    })

    const updatedTrack = {
      ...track, 
      url: downloadedAudioFile?.uri,
    }

    return updatedTrack
  }) as RNTrack[];

  albumData.tracks = downloadedTracks

  console.log(albumData);

  const stringifiedData = JSON.stringify(albumData)
  await AsyncStorage.setItem(`${albumData.title}-${albumData.id}`, stringifiedData)
  } catch (err) {
    console.error("Error storing Album data: ", err);
  }
}

async function getAlbumData(albumStored: string) {
  // albumStored looks like: `${album.title}-${album-id}`
  try {
  const albumData = await AsyncStorage.getItem(albumStored)

  if (albumData) {
    const jsonAlbumData = JSON.parse(albumData)
    return jsonAlbumData;
  }

  console.log(`No data stored under ${albumStored}`)
  return undefined;
  } catch(err) {
    console.log("Error getting stored Album data: ", err)
  }
}

