import { useState } from "react";
import usePlacesAutocomplete, { Suggestion } from "use-places-autocomplete";

interface IUsePlacesSearchProps {
  requestOptions: google.maps.places.AutocompleteOptions;
  onSelect?: (idx: number, place: Suggestion) => void;
}

export function usePlacesSearch({
  requestOptions,
  onSelect,
}: IUsePlacesSearchProps) {
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

  const onSelectWithForm = (idx: number, place: Suggestion) => {
    if (selectedIdx === idx) {
      setSelectedIdx(null);
      setCurrIdx(idx);
      return;
    } else {
      setSelectedIdx(idx);
      setCurrIdx(idx);
      setValue(place.structured_formatting.main_text, false);
    }
  };

  return {
    value,
    setValue,
    suggestions,
    currIdx,
    setCurrIdx,
    selectedIdx,
    setSelectedIdx,
    onSelect: onSelect ?? onSelectWithForm,
  };
}
