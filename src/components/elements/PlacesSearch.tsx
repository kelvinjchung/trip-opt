"use client";

import { CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import { Input } from "../ui/input";

interface PlacesSearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  requestOptions?: google.maps.places.AutocompleteOptions;
}

const PlacesSearch = ({
  placeholder,
  requestOptions,
  name,
  ...inputProps
}: PlacesSearchProps) => {
  // currIdx is the index of the currently highlighted option
  // currIdx === null when listbox is not expanded
  const [currIdx, setCurrIdx] = useState<number | null>(null);

  // selectedIdx === null when no option is selected
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

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
  console.log(`currIdx: ${currIdx}\nselectedIdx: ${selectedIdx}`);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setSelectedIdx(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handleSelect();
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

  const handleFocus = () => {
    setCurrIdx(0);
  };

  const handleBlur = () => {
    setCurrIdx(null);
    if (selectedIdx === null) setValue("");
  };

  const handlePointerMove = (idx: number) => () => {
    setCurrIdx(idx);
  };

  const handleSelect = () => {
    if (selectedIdx === currIdx) {
      setSelectedIdx(null);
      return;
    } else {
      setSelectedIdx(currIdx);
      setValue(data[currIdx!].structured_formatting.main_text, false);
    }
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
        {idx === selectedIdx && <CheckIcon />}
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
              // to prevent input from losing focus when clicking on listbox options
              onMouseDown={(e) => e.preventDefault()}
            >
              {suggestions}
            </div>
          );
      }
    }
  };

  const aggregateSelectedData = () => {
    if (selectedIdx !== null) {
      const place_id = data[selectedIdx].place_id;
      return (
        <Input
          type="hidden"
          name={`${name}[place_id]`}
          value={place_id}
          aria-hidden
        />
      );
    }
  };

  return (
    <div>
      <Input
        {...inputProps}
        placeholder={placeholder}
        value={value}
        name={name}
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
      {aggregateSelectedData()}
    </div>
  );
};

export default PlacesSearch;
