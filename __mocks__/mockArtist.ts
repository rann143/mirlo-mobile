import { faker } from "@faker-js/faker";

// trackGroups defaults to [] to avoid mutual recursion with createMockAlbum
// (which itself includes an artist). Override explicitly when a populated
// artist with albums is needed
export const createMockArtist = (overrides?: Partial<Artist>): Artist => ({
  id: faker.number.int(),
  userId: faker.number.int(),
  name: faker.person.fullName(),
  bio: faker.lorem.paragraphs(2),
  activityPub: faker.datatype.boolean(),
  enabled: true,
  createdAt: faker.date.past().toISOString(),
  trackGroups: [],
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
