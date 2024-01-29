import { useState } from "react";
import usePlacesAutocomplete, { Suggestion } from "use-places-autocomplete";

interface IUsePlacesSearchProps {
  requestOptions: Omit<google.maps.places.AutocompletionRequest, "input">;
}

export function usePlacesSearch({ requestOptions }: IUsePlacesSearchProps) {
  const { value, setValue, suggestions } = usePlacesAutocomplete({
    requestOptions,
    cache: 24 * 60 * 60,
    debounce: 300,
  });

  // currIdx is the index of the currently highlighted option
  // currIdx === null when listbox is not expanded
  const [currIdx, setCurrIdx] = useState<number | null>(null);

  // selectedIdx === null when no option is selected
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return {
    value,
    setValue,
    suggestions,
    currIdx,
    setCurrIdx,
    selectedIdx,
    setSelectedIdx,
  };
}
