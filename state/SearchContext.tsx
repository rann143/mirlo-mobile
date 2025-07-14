import { useState, createContext, useContext } from "react";
import SearchItem from "@/components/SearchItem";
import * as api from "../queries/fetch/fetchWrapper";
import { useTranslation } from "react-i18next";

type SearchContextType = {
  isSearching: boolean;
  setIsSearching: (searchStatus: boolean) => void;

  getOptions: (val: string) => Promise<Result[]> | Result[] | undefined;
  onSelect?: (
    value:
      | string
      | number
      | {
          id: string | number;
          name: string;
          isNew?: boolean;
        }
  ) => void;
  searchResults: Result[];
  setSearchResults: (results: Result[]) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  searchValue: string;
  setSearchValue: (val: string) => void;
};

export type Result = {
  id: number | string;
  name: string;
  category?: string;
  artistId?: number | string;
  trackGroupId?: number | string;
  artistName?: string;
  avatar?: {
    url: string;
    sizes?: { [key: string]: string };
    updatedAt: string;
  };
  trackGroupCover?: {
    sizes: {
      60: string;
      120: string;
      300: string;
      600: string;
      960: string;
      1200: string;
      1500: string;
    };
  };
};

export const SearchContext = createContext<SearchContextType | null>(null);

export const SearchContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchValue, setSeachValue] = useState<string>("");
  const { t } = useTranslation();

  async function getOptions(searchString: string) {
    const artists = await api.getMany<Artist>(
      `/v1/artists`,
      {},
      { name: searchString }
    );
    const trackGroups = await api.getMany<AlbumProps>(
      `/v1/trackGroups`,
      {},
      { title: searchString }
    );
    const tracks = await api.getMany<RNTrack>(
      `/v1/tracks`,
      {},
      { title: searchString }
    );
    const results = [
      ...artists.results.map((r, rid) => ({
        firstInCategory: rid === 0,
        category: t("label.artist"),
        artistId: r.urlSlug ?? r.id,
        id: r.id,
        avatar: r.avatar,
        name: r.name,
        isArtist: true,
      })),
      ...trackGroups.results.map((tr, trid) => ({
        firstInCategory: trid === 0,
        category: t("manageArtistTools.album"),
        id: tr.urlSlug ?? tr.id,
        artistId: tr.artist?.urlSlug ?? tr.artistId,
        artistName: tr.artist.name,
        trackGroupId: tr.urlSlug ?? tr.id,
        trackGroupCover: tr.cover,
        name: tr.title,
        isTrackGroup: true,
      })),
      ...tracks.results.map((tr, trid) => ({
        firstInCategory: trid === 0,
        id: tr.id,
        category: t("trackDetails.track").replace(":", ""),
        trackGroupId: tr.trackGroup.urlSlug ?? tr.trackGroupId,
        artistId: tr.trackGroup.artist.urlSlug ?? tr.trackGroup.artistId,
        artistName: tr.trackGroup.artist.name,
        trackGroupCover: tr.trackGroup.cover,
        name: tr.title,
        isTrack: true,
      })),
    ];

    return results;
  }

  const value: SearchContextType = {
    isSearching: isSearching,
    setIsSearching: setIsSearching,
    getOptions: getOptions,
    searchResults: searchResults,
    setSearchResults: setSearchResults,
    showSuggestions: showSuggestions,
    setShowSuggestions: setShowSuggestions,
    searchValue: searchValue,
    setSearchValue: setSeachValue,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export function useSearch(): SearchContextType {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within a SearchContext Provider");
  }

  return context;
}
