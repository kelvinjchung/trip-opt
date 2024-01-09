"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { SetValue, Suggestion, Suggestions } from "use-places-autocomplete";
import { Input } from "../ui/input";

interface IPlacesSearchProps {
  placeholder: string;
  value: string;
  setValue: SetValue;
  suggestions: Suggestions;
  currIdx: number | null;
  setCurrIdx: React.Dispatch<React.SetStateAction<number | null>>;
  selectedIdx: number | null;
  setSelectedIdx: React.Dispatch<React.SetStateAction<number | null>>;
  // onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // onFocus: () => void;
  // onBlur: () => void;
  // onPointerMove: (idx: number) => () => void;
  // onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSelect: (idx: number, place: Suggestion) => void;
  // onSelectNoForm?: (place: Suggestion) => void;
}

const PlacesSearch = ({
  placeholder,
  value,
  setValue,
  suggestions: { loading, status, data },
  currIdx,
  setCurrIdx,
  selectedIdx,
  setSelectedIdx,
  // onInputChange,
  // onFocus,
  // onBlur,
  // onPointerMove,
  onSelect,
  // onKeyDown,
}: IPlacesSearchProps) => {
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setSelectedIdx(null);
  };

  const onFocus = () => {
    setCurrIdx(0);
  };

  const onBlur = () => {
    setCurrIdx(null);
    if (selectedIdx === null) setValue("");
  };

  const onPointerMove = (idx: number) => () => {
    setCurrIdx(idx);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (data.length === 0) return;
        onSelect(currIdx!, data[currIdx!]);
        break;
      case "Escape":
        e.currentTarget.blur();
        break;
      case "ArrowUp":
        e.preventDefault();
        if (currIdx !== null && currIdx > 0) setCurrIdx(currIdx - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (currIdx !== null && currIdx < data.length - 1)
          setCurrIdx(currIdx + 1);
        break;
      default:
        break;
    }
  };

  const renderSuggestions = () => {
    // TODO: use shadcn skeleton
    let errorMessage = "";
    const className =
      "absolute my-1 w-full rounded-md border border-input bg-white p-3 text-sm shadow-md";
    if (loading)
      return (
        <div role="progressbar" className={className}>
          Loading...
        </div>
      );
    else {
      switch (status) {
        case "OK":
          // TODO: might need to make ids unique per listbox if multiple PlacesSearch components are on one page
          return (
            <div
              className={cn(className, "p-1")}
              role="listbox"
              id={`placesSearch-listbox`}
              // to prevent input from losing focus when clicking on listbox options
              onMouseDown={(e) => e.preventDefault()}
            >
              {data.map(
                (
                  {
                    place_id,
                    structured_formatting: { main_text, secondary_text },
                  },
                  idx: number,
                ) => (
                  <div
                    key={place_id}
                    id={`placesSearch-listbox-option-${idx}`}
                    className="flex cursor-pointer items-center rounded-md px-2 py-1.5 aria-selected:bg-accent aria-selected:text-accent-foreground"
                    onPointerMove={onPointerMove(idx)}
                    onClick={() => onSelect(idx, data[idx])}
                    role="option"
                    aria-selected={currIdx === idx}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm">{main_text}</span>
                      <span className="text-xs">{secondary_text}</span>
                    </div>
                    {idx === selectedIdx && (
                      <CheckIcon className="ml-auto h-6 w-6" />
                    )}
                  </div>
                ),
              )}
            </div>
          );
        case "ZERO_RESULTS":
        case "NOT_FOUND":
          errorMessage = "No results found";
          break;
        case "INVALID_REQUEST":
        case "UNKNOWN_ERROR":
          errorMessage = "Error";
          break;
        case "OVER_QUERY_LIMIT":
          errorMessage = "API Query Limit Reached";
          break;
        default:
          return;
      }
      // if didn't return in switch statement, then render error message
      return (
        <div role="presentation" className={className}>
          {errorMessage}
        </div>
      );
    }
  };

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
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
