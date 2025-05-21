import { faker } from "@faker-js/faker";
import { createMockAlbum } from "./mockAlbum"; // assumes mockAlbum exists
import { createMockUser } from "./mockUser"; // optional, if you have User

export const createMockArtist = (overrides?: Partial<Artist>): Artist => ({
  id: faker.number.int(),
  userId: faker.number.int(),
  name: faker.person.fullName(),
  bio: faker.lorem.paragraphs(2),
  activityPub: faker.datatype.boolean(),
  enabled: true,
  createdAt: faker.date.past().toISOString(),
  trackGroups: [createMockAlbum(), createMockAlbum()],
  urlSlug: faker.helpers.slugify(faker.person.fullName().toLowerCase()),
  location: faker.location.city(),
  artistLabels: [],
  links: [faker.internet.url(), faker.internet.url()],
  avatar: {
    url: faker.image.avatar(),
    sizes: {
      small: faker.image.avatar(),
      medium: faker.image.avatar(),
    },
    updatedAt: faker.date.recent().toISOString(),
  },
  ...overrides,
});
