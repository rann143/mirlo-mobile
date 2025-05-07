import { useState, createContext, useContext } from "react";
import SearchItem from "@/components/SearchItem";
import * as api from "../queries/fetch/fetchWrapper";
import { ExternalPathString, Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

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
  optionDisplay: (
    result: {
      id: number | string;
      name: string;
      artistId?: string | number;
      trackGroupId?: string | number;
      firstInCategory?: boolean;
      category?: string;
    },
    index: number
  ) => React.ReactElement;
  searchResults: Result[];
  setSearchResults: (results: Result[]) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  searchValue: string;
  setSearchValue: (val: string) => void;
};

type Result = {
  id: number | string;
  name: string;
  isNew?: boolean;
  firstInCategory?: boolean;
  category?: string;
};

export const SearchContext = createContext<SearchContextType | null>(null);

export const SearchContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchValue, setSeachValue] = useState<string>("");

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
        category: "Artist",
        artistId: r.urlSlug ?? r.id,
        id: r.id,
        name: r.name,
        isArtist: true,
      })),
      ...trackGroups.results.map((tr, trid) => ({
        firstInCategory: trid === 0,
        category: "Album",
        id: tr.urlSlug ?? tr.id,
        artistId: tr.artist?.urlSlug ?? tr.artistId,
        trackGroupId: tr.urlSlug ?? tr.id,
        name: tr.title,
        isTrackGroup: true,
      })),
      ...tracks.results.map((tr, trid) => ({
        firstInCategory: trid === 0,
        id: tr.id,
        category: "Track",
        trackGroupId: tr.trackGroup.urlSlug ?? tr.trackGroupId,
        artistId: tr.trackGroup.artist.urlSlug ?? tr.trackGroup.artistId,
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
    optionDisplay: (
      result: {
        id: number | string;
        name: string;
        category?: string;
        artistId?: number | string;
        trackGroupId?: number | string;
      },
      index: number
    ) => {
      return <SearchItem result={result} index={index} />;
    },
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
  console.log("useSearch called");
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within a SearchContext Provider");
  }

  return context;
}
