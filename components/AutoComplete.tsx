import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { debounce } from "lodash";

type AutoCompleteProps = {
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
};

type Result = {
  id: number | string;
  name: string;
  isNew?: boolean;
  firstInCategory?: boolean;
  category?: string;
};

export default function AutoComplete({
  getOptions,
  onSelect,
  optionDisplay,
}: AutoCompleteProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const {
    control,
    formState: { errors },
  } = useForm();
  const { width, height } = useWindowDimensions();
  const onChangeValue = useCallback((text: string) => {
    setSearchValue(text);
  }, []);

  const searchCallback = useCallback(
    debounce(async (searchString: string) => {
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
    }, 500),
    [getOptions]
  );

  useEffect(() => {
    searchCallback(searchValue);
  }, [searchCallback, searchValue]);

  return (
    <View style={{ flex: 1 }}>
      <Controller
        control={control}
        name="search"
        render={() => (
          <TextInput
            style={{
              backgroundColor: "lightblue",
              flex: 1,
              height: "70%",
              paddingHorizontal: 20,
            }}
            value={searchValue}
            onChangeText={onChangeValue}
          />
        )}
      />
      {showSuggestions && (
        <View
          onResponderRelease={() => {
            setShowSuggestions(false);
            setSearchValue("");
          }}
          style={{
            zIndex: 99,
            // height: height,
            // width: width,
            backgroundColor: "offwhite",
          }}
        >
          <FlatList
            data={searchResults}
            renderItem={({ item, index }) => optionDisplay(item, index)}
            keyExtractor={(item, index) => `${index}-${item.id || item.name}`}
          />
          {/* {searchResults.map((r, index) => {
              return optionDisplay ? (
                optionDisplay(r, index)
              ) : (
                <Text>Hello</Text>
              );
            })} */}
        </View>
      )}
    </View>
  );
}
