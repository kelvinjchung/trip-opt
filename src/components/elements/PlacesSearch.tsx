"use client";

import { useState } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import { Input } from "../ui/input";

interface PlacesSearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  requestOptions?: google.maps.places.AutocompleteOptions;
}

const PlacesSearch = ({ placeholder, requestOptions }: PlacesSearchProps) => {
  // currIdx === null when listbox is not expanded
  const [currIdx, setCurrIdx] = useState<number | null>(null);
  const {
    suggestions: { loading, status, data },
    value,
    setValue,
  } = usePlacesAutocomplete({
    requestOptions,
    cache: 24 * 60 * 60,
    debounce: 300,
  });

  // * FOR TESTING: DELETE LATER
  console.log(`loading: ${loading}\nstatus: ${status}\n data:`, data);
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
        if (currIdx !== null && currIdx > 0) setCurrIdx(currIdx - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (currIdx !== null && currIdx < data.length - 1)
          setCurrIdx(currIdx + 1);
        console.log("ArrowDown");
        break;
      default:
        break;
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value !== "" && loading === false) setCurrIdx(0);
  };

  const handleBlur = () => {
    setCurrIdx(null);
    setValue("");
  };

  const handlePointerMove = (idx: number) => () => {
    setCurrIdx(idx);
  };

  const handleSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation;
    e.preventDefault();
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
        id={`placesSearch-listbox-option-${idx}`}
        className="aria-selected:bg-accent aria-selected:text-accent-foreground"
        onPointerMove={handlePointerMove(idx)}
        onClick={handleSelect}
        role="option"
        aria-selected={currIdx === idx}
      >
        <span>{main_text}</span>
        <span>{secondary_text}</span>
      </div>
    ),
  );

  const renderSuggestions = () => {
    // TODO: use shadcn skeleton
    if (loading) return <div role="progressbar">Loading...</div>;
    else {
      switch (status) {
        case "ZERO_RESULTS":
        case "NOT_FOUND":
          return <div role="presentation">No results found.</div>;
        case "INVALID_REQUEST":
        case "UNKNOWN_ERROR":
          return <div role="presentation">Error</div>;
        case "OVER_QUERY_LIMIT":
          return <div role="presentation">Over API query limit</div>;
        case "OK":
          // TODO: might need to make ids unique per listbox if multiple PlacesSearch components are on one page
          return (
            <div
              role="listbox"
              id={`placesSearch-listbox`}
              onMouseDown={(e) => e.preventDefault()}
            >
              {suggestions}
            </div>
          );
      }
    }
  };

  return (
    <div>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={currIdx !== null}
        aria-controls="placesSearch-listbox"
        aria-activedescendant={
          currIdx !== null
            ? `placesSearch-listbox-option-${currIdx}`
            : undefined
        }
      />
      {currIdx !== null && renderSuggestions()}
    </div>
  );
};

export default PlacesSearch;
