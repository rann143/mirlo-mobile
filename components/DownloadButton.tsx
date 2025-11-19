import Ionicons from "@expo/vector-icons/Ionicons";
import * as api from "../queries/fetch/fetchWrapper";
import { View } from "react-native";
import * as fs from "expo-file-system";
import { unzip } from "react-native-zip-archive";

export default function DownloadButton() {
  return <View></View>;
}

async function downloadAudio(format: string, prefix: string) {
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
    );
    console.log(downloadRes);
  } catch (err) {
    console.log(err);
  }
}
