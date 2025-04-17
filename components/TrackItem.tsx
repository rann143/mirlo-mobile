import { useAuthContext } from "@/state/AuthContext";
import { View, StyleSheet, Text } from "react-native";
import PlayButton from "./PlayButton";
import { isTrackOwnedOrPreview } from "@/scripts/utils";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Number(seconds.toFixed(0)) % 60;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}

type TrackItemComponentProps = {
  track: RNTrack;
  album: AlbumProps;
  thisSongSelected: boolean;
};

export const TrackItem = ({
  track,
  album,
  thisSongSelected,
}: TrackItemComponentProps) => {
  const { user } = useAuthContext();

  const canPlayTrack = isTrackOwnedOrPreview(track, user, album);

  if (!canPlayTrack) {
    return (
      <View style={[styles.listItem, { backgroundColor: "#BE3455" }]}>
        <Text
          style={{ color: "darkgrey", fontSize: 20, paddingRight: 10 }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {track.title}
        </Text>
        <Text style={{ color: "grey", fontSize: 15, marginRight: 20 }}>
          {track.audio.duration ? formatTime(track.audio.duration) : 0}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listItem}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "70%",
        }}
      >
        {album?.tracks && (
          <Text
            style={{
              color: "black",
              fontSize: 20,
              marginRight: 30,
              marginLeft: 5,
              fontWeight: thisSongSelected ? "bold" : "normal",
            }}
          >
            {track.order}.
          </Text>
        )}
        <Text
          style={{
            color: "black",
            fontSize: 18,
            marginRight: 5,
            fontWeight: thisSongSelected ? "bold" : "normal",
          }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {track.title}
        </Text>
      </View>
      <View>
        <Text
          style={{
            color: "black",
            fontSize: 15,
            marginRight: 10,
            fontWeight: thisSongSelected ? "bold" : "normal",
          }}
        >
          {track.audio.duration ? formatTime(track.audio.duration) : 0}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    justifyContent: "space-between",
    marginVertical: 5,
  },
});
