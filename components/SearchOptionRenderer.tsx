// components/SearchOptionRenderer.tsx
import React from "react";
import SearchItem from "./SearchItem";
import { Result } from "@/state/SearchContext";

export function optionDisplay(
  result: Result,
  index: number
): React.ReactElement {
  return <SearchItem result={result} index={index} />;
}
