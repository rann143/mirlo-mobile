import AsyncStorage from "@react-native-async-storage/async-storage";

const MAX_PLAYS = 3;

async function getPlays(trackId: number): Promise<number | undefined> {
  try {
    const id = String(trackId);
    const plays = await AsyncStorage.getItem(id);

    if (plays !== null) {
      return Number(plays);
    }

    return 0;
  } catch (err) {
    console.error(err);
  }
}

export async function reachedMaxPlays(trackId: number, maxFreePlays?: number) {
  try {
    const plays: number | undefined = await getPlays(trackId);

    if (plays === undefined) {
      console.error(
        "Issue getting number of plays: 'number of plays undefined'",
      );
      return;
    }

    if (maxFreePlays !== undefined) {
        console.log(maxFreePlays);
      if (plays >= maxFreePlays) {
        return true;
      }
    } else {
        console.log('No maxFreePlays set');
        return;
    }

    return false;
  } catch (err) {
    console.error(err);
  }
}

export async function incrementPlayCount(trackId: number) {
  try {
    const numPlays = await getPlays(trackId);

    if (numPlays === undefined) {
      console.error(
        "Issue getting number of plays: 'number of plays undefined'",
      );
      return;
    }

    if (numPlays === 0) {
      await AsyncStorage.setItem(String(trackId), "1");
      const updated = await AsyncStorage.getItem(String(trackId));
      console.log("trackId: " + String(trackId) + ", plays: " + updated);
      return;
    } else {
      const updatedPlays = numPlays + 1;
      await AsyncStorage.setItem(String(trackId), String(updatedPlays));
      const updated = await AsyncStorage.getItem(String(trackId));
      console.log("trackId: " + String(trackId) + ", plays: " + updated);
      return;
    }
  } catch (err) {
    console.error(err);
  }
}
