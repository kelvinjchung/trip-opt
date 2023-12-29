"use client";

import { useState } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import { Input } from "../ui/input";

interface PlacesSearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  requestOptions?: google.maps.places.AutocompleteOptions;
}

const PlacesSearch = ({ placeholder, requestOptions }: PlacesSearchProps) => {
  const [currIdx, setCurrIdx] = useState<number>(0);

  const {
    suggestions: { status, data },
    value,
    setValue,
  } = usePlacesAutocomplete({
    requestOptions,
    cache: 24 * 60 * 60,
    debounce: 300,
  });

  console.log(`status: ${status}\n data:`, data);
  console.log(`currIdx: ${currIdx}`);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setCurrIdx(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        console.log("Enter");
        break;
      case "Escape":
        e.currentTarget.blur();
        break;
      case "ArrowUp":
        e.preventDefault();
        console.log("ArrowUp");
        if (currIdx > 0) setCurrIdx(currIdx - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (currIdx < data.length - 1) setCurrIdx(currIdx + 1);
        console.log("ArrowDown");
        break;
      default:
        break;
    }
  };

  const handlePointerMove = (idx: number) => () => {
    setCurrIdx(idx);
  };

  const suggestions = data.map(
    (
      {
        place_id,
        // description,
        structured_formatting: { main_text, secondary_text },
      },
      idx: number,
    ) => (
      <div
        key={place_id}
        className="aria-selected:bg-accent aria-selected:text-accent-foreground"
        role="option"
        onPointerMove={handlePointerMove(idx)}
        aria-selected={currIdx === idx}
      >
        <span>{main_text}</span>
        <span>{secondary_text}</span>
      </div>
    ),
  );

  // TODO: add loading
  const suggestionsLoading = <div role="progressbar">Loading...</div>;

  // const suggestionsError =

  const suggestionsNone = <div role="presentation">No results found.</div>;

  return (
    <div>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        aria-autocomplete="list"
        role="combobox"
      />
      {status === "OK" && <div role="listbox">suggestions</div>}
      {(status === "ZERO_RESULTS" || status === "NOT_FOUND") && suggestionsNone}
      {status === "INVALID_REQUEST" || status === "UNKNOWN_ERROR"}
      {status === "OVER_QUERY_LIMIT" && <div>Over query limit</div>}
    </div>
  );
};

export default PlacesSearch;
