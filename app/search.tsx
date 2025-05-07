import { debounce } from "lodash";
import SearchHeader from "@/components/SearchHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { useSearch } from "@/state/SearchContext";
import { useCallback, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Footer from "@/components/Footer";

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
    isSearching,
  } = useSearch();
  const { top, bottom } = useSafeAreaInsets();

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
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        paddingTop: top,
        paddingBottom: bottom,
        justifyContent: "space-between",
      }}
    >
      <SearchHeader style={{ borderBottomWidth: 0, marginBottom: 0 }} />

      {isSearching && (
        <View style={{ marginVertical: 30, flex: 1 }}>
          <ActivityIndicator
            size="large"
            color="#BE3455"
            style={styles.loadSpinner}
          />
        </View>
      )}

      {searchValue &&
        showSuggestions &&
        !isSearching &&
        searchResults.length < 1 && (
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Text style={{ margin: 20, fontSize: 20 }}>
              Hmmm, couldn't find anything for that search... Try again!
            </Text>
          </View>
        )}

      {!isSearching && showSuggestions && searchResults.length > 0 && (
        <FlatList
          style={{
            backgroundColor: "white",
            flex: 1,
            width: "100%",
          }}
          data={searchResults}
          renderItem={({ item, index }) => optionDisplay(item, index)}
          keyExtractor={(item, index) => `${index}-${item.id || item.name}`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadSpinner: {
    flex: 1,
  },
});
