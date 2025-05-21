import { faker } from "@faker-js/faker";
import { createMockArtist } from "./mockArtist"; // You should define this based on your Artist interface
import { createMockRNTrack } from "./mockRNTrack";

export const createMockAlbum = (
  overrides?: Partial<AlbumProps>
): AlbumProps => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  cover: {
    sizes: {
      60: faker.image.urlLoremFlickr({
        category: "music",
        width: 60,
        height: 60,
      }),
      120: faker.image.urlLoremFlickr({
        category: "music",
        width: 120,
        height: 120,
      }),
      300: faker.image.urlLoremFlickr({
        category: "music",
        width: 300,
        height: 300,
      }),
      600: faker.image.urlLoremFlickr({
        category: "music",
        width: 600,
        height: 600,
      }),
      960: faker.image.urlLoremFlickr({
        category: "music",
        width: 960,
        height: 960,
      }),
      1200: faker.image.urlLoremFlickr({
        category: "music",
        width: 1200,
        height: 1200,
      }),
      1500: faker.image.urlLoremFlickr({
        category: "music",
        width: 1500,
        height: 1500,
      }),
    },
  },
  title: faker.music.songName(),
  artist: createMockArtist(),
  artistId: faker.number.int({ min: 1, max: 1000 }),
  urlSlug: faker.helpers.slugify(faker.music.songName().toLowerCase()),
  userTrackGroupPurchases: [],
  releaseDate: faker.date.past().toISOString(),
  tracks: [createMockRNTrack(), createMockRNTrack(), createMockRNTrack()],
  about: faker.lorem.paragraph(),
  tags: [faker.music.genre(), faker.music.genre()],
  trackGroupId: faker.number.int({ min: 1000, max: 9999 }),
  ...overrides,
});
