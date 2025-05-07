import { debounce } from "lodash";
import SearchHeader from "@/components/SearchHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, FlatList } from "react-native";
import { useSearch } from "@/state/SearchContext";
import { useCallback, useEffect, useRef } from "react";

export default function SearchPage() {
  const {
    showSuggestions,
    setShowSuggestions,
    optionDisplay,
    searchResults,
    setSearchValue,
    setIsSearching,
    getOptions,
    setSearchResults,
    searchValue,
  } = useSearch();

  const searchCallbackRef = useRef(
    debounce(async (searchString) => {
      if (searchString && searchString.length > 1) {
        setShowSuggestions(true);
        setIsSearching(true);
        const results = await getOptions(searchString);

        setSearchResults(results ?? []);
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }, 500)
  ).current;

  useEffect(() => {
    searchCallbackRef(searchValue);
  }, [searchValue]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <SearchHeader style={{ borderBottomWidth: 0, marginBottom: 0 }} />

      {showSuggestions && (
        <FlatList
          style={{ backgroundColor: "coral", flex: 1 }}
          data={searchResults}
          renderItem={({ item, index }) => optionDisplay(item, index)}
          keyExtractor={(item, index) => `${index}-${item.id || item.name}`}
        />
      )}
    </SafeAreaView>
  );
}
