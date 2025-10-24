import {
  keepPreviousData,
  QueryFunction,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "./fetch/fetchWrapper";
import { MirloFetchError } from "./fetch/MirloFetchError";

const fetchTrackGroups: QueryFunction<
  { results: AlbumProps[] },
  [
    "fetchTrackGroups",
    {
      skip?: number;
      take?: number;
      orderBy?: "random";
      tag?: string;
      distinctArtists?: boolean;
    },
    ...any,
  ]
> = ({
  queryKey: [_, { skip, take, orderBy, tag, distinctArtists }],
  signal,
  pageParam = 0,
}) => {
  const params = new URLSearchParams();
  if (skip || pageParam) params.append("skip", String(pageParam || skip));
  if (take) params.append("take", String(take));
  if (orderBy) params.append("orderBy", orderBy);
  if (tag) params.append("tag", tag);
  params.append("distinctArtists", String(distinctArtists ?? false));
  return api.get(`/v1/trackGroups?${params}`, { signal });
};

export function queryTrackGroups(opts: {
  skip?: number;
  take?: number;
  orderBy?: "random";
  tag?: string;
  distinctArtists: boolean;
}) {
  return queryOptions({
    queryKey: ["fetchTrackGroups", opts],
    queryFn: fetchTrackGroups,
    placeholderData: keepPreviousData,
  });
}

const fetchTopSold: QueryFunction<
  { results: AlbumProps[] },
  [
    "fetchTopSold",
    {
      take?: number;
      datePurchased?: string;
    },
  ]
> = ({ queryKey: [_, { take, datePurchased }], signal }) => {
  const params = new URLSearchParams();
  if (take) params.append("take", String(take));
  if (datePurchased) params.append("datePurchased", String(datePurchased));
  return api.get(`/v1/trackGroups/topSold?${params}`, { signal });
};

export function queryTopSold(opts: { take?: number; datePurchased?: string }) {
  return queryOptions({
    queryKey: ["fetchTopSold", opts],
    queryFn: fetchTopSold,
  });
}

const fetchMostPlayed: QueryFunction<
  { results: AlbumProps[] },
  [
    "fetchMostPlayed",
    {
      take?: number;
    },
  ]
> = ({ queryKey: [_, { take }], signal }) => {
  const params = new URLSearchParams();
  if (take) params.append("take", String(take));
  return api.get(`/v1/trackGroups/mostPlayed?${params}`, { signal });
};

export function queryMostPlayed(opts: { take?: number }) {
  return queryOptions({
    queryKey: ["fetchMostPlayed", opts],
    queryFn: fetchMostPlayed,
  });
}
const fetchUserPurchases: QueryFunction<
  { results: UserTransaction[] },
  ["fetchUserPurchases", { userId: number | undefined }, ...any]
> = ({ queryKey: [_, { userId }], signal }) => {
  return api.get(`/v1/users/${userId}/purchases`, {});
};

export function queryUserPurchases(userId: number | undefined) {
  return queryOptions({
    queryKey: ["fetchUserPurchases", { userId }],
    queryFn: fetchUserPurchases,
    enabled: !!userId,
  });
}

const fetchAlbum: QueryFunction<
  { result: AlbumProps },
  [
    "fetchAlbum",
    {
      slug: string | string[];
      id: string | string[];
    },
  ]
> = ({ queryKey: [_, { slug, id }], signal }) => {
  const safeSlug = Array.isArray(slug) ? slug[0] : slug;
  const safeId = Array.isArray(id) ? id[0] : id;

  return api.get(`/v1/trackGroups/${safeSlug}/?artistId=${safeId}`, { signal });
};

export function queryAlbum(opts: {
  slug: string | string[];
  id: string | string[];
}) {
  return queryOptions({
    queryKey: ["fetchAlbum", opts],
    queryFn: fetchAlbum,
    enabled: !!opts.slug && !!opts.id,
  });
}

const fetchArtist: QueryFunction<
  Artist,
  ["fetchArtist", { artistSlug: string }]
> = ({ queryKey: [_, { artistSlug }], signal }) => {
  return api
    .get<{ result: Artist }>(`/v1/artists/${artistSlug}`, {
      signal,
    })
    .then((r) => r.result);
};

export function queryArtist(opts: { artistSlug: string }) {
  return queryOptions({
    queryKey: [
      "fetchArtist",
      {
        artistSlug: opts.artistSlug,
      },
    ],
    queryFn: fetchArtist,
    enabled: !!opts.artistSlug,
  });
}
const fetchTags: QueryFunction<
  { results: Tag[]; total?: number },
  [
    "fetchTags",
    {
      skip?: number;
      take?: number;
      orderBy?: "asc" | "count";
    },
    ...any,
  ]
> = ({ queryKey: [_, { skip, take, orderBy }], signal }) => {
  const params = new URLSearchParams();
  if (skip) params.append("skip", String(skip));
  if (take) params.append("take", String(take));
  if (orderBy) params.append("orderBy", orderBy);

  return api.get(`/v1/tags?${params}`, { signal });
};

export function queryTags(opts: {
  skip?: number;
  take?: number;
  orderBy?: "asc" | "count";
}) {
  return queryOptions({
    queryKey: ["fetchTags", opts, "tags"],
    queryFn: fetchTags,
  });
}

const fetchWishlist: QueryFunction<
  {
    results: {
      userId: number;
      trackGroupId: number;
      trackGroup: AlbumProps;
      createdAt: Date;
    }[];
  },
  ["fetchWishlist", { userId: number | undefined }, ...any]
> = ({ queryKey: [_, { userId }], signal }) => {
  return api.get(`/v1/users/${userId}/wishlist`, {});
};

export function queryWishlist(userId: number | undefined) {
  return queryOptions({
    queryKey: ["fetchWishlist", { userId }],
    queryFn: fetchWishlist,
    enabled: !!userId,
  });
}
