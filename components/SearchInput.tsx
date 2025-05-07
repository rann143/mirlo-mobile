import { useSearch } from "@/state/SearchContext";
import { Controller, useForm } from "react-hook-form";
import { useCallback } from "react";
import { TextInput, useWindowDimensions, View } from "react-native";

export default function SearchInput() {
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
    <View style={{ paddingVertical: 10, flex: 1 }}>
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
