import {
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
    ...any
  ]
> = ({
  queryKey: [_, { skip, take, orderBy, tag, distinctArtists }],
  signal,
}) => {
  const params = new URLSearchParams();
  if (skip) params.append("skip", String("skip"));
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
  });
}

const fetchUserPurchases: QueryFunction<
  { results: UserTrackGroupPurchase[] },
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
    }
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
