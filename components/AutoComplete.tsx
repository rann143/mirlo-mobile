import { useSearch } from "@/state/SearchContext";
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
  const { searchValue, setSearchValue } = useSearch();
  const {
    control,
    formState: { errors },
  } = useForm();
  const { width, height } = useWindowDimensions();
  const onChangeValue = useCallback((text: string) => {
    setSearchValue(text);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Controller
        control={control}
        name="search"
        render={() => (
          <TextInput
            style={{
              backgroundColor: "lightgrey",
              borderRadius: 10,
              marginLeft: 10,
              flex: 1,
              height: "70%",
              paddingHorizontal: 20,
              fontSize: 20,
            }}
            value={searchValue}
            onChangeText={onChangeValue}
          />
        )}
      />
    </View>
  );
}
