import { faker } from "@faker-js/faker/.";
import { createMockArtist } from "./mockArtist";

export const createMockRNTrack = (overrides?: Partial<RNTrack>): RNTrack => ({
  title: faker.music.songName(),
  artist: faker.music.artist(),
  artwork: faker.image.url(),
  url: faker.internet.url(),
  id: faker.number.int(),
  queueIndex: 0,
  trackGroupId: faker.number.int(),
  trackGroup: {
    title: faker.music.album(),
    userTrackGroupPurchases: [{ userId: faker.number.int() }],
    artist: createMockArtist(),
    artistId: faker.number.int(),
    urlSlug: faker.music.album(),
    cover: {
      sizes: {
        60: faker.image.url(),
        120: faker.image.url(),
        300: faker.image.url(),
        600: faker.image.url(),
        960: faker.image.url(),
        1200: faker.image.url(),
        1500: faker.image.url(),
      },
    },
  },
  audio: {
    url: faker.internet.url(),
    duration: 230,
  },
  isPreview: true,
  order: 0,
  headers: {},
});
