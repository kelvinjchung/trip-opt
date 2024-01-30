import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { createContext, forwardRef, useContext } from "react";
import { SetValue, Suggestions } from "use-places-autocomplete";
import { Input } from "../ui/input";

type PlacesSearchContextProps = {
  listboxId: string;
  suggestions: Suggestions;
  currIdx: number | null;
  setCurrIdx: React.Dispatch<React.SetStateAction<number | null>>;
  selectedIdx: number | null;
  setSelectedIdx: React.Dispatch<React.SetStateAction<number | null>>;
  onSelect(idx: number): void;
};

const PlacesSearchContext = createContext<PlacesSearchContextProps | null>(
  null,
);

const usePlacesSearchContext = () => {
  const context = useContext(PlacesSearchContext);
  if (!context) {
    throw new Error(
      "PlacesSearch.* components cannot be rendered outside the PlacesSearch component",
    );
  }
  return context;
};

interface PlacesSearchProps
  extends Omit<PlacesSearchContextProps, "listboxId"> {
  children: React.ReactNode;
  id?: string;
}

const PlacesSearch = ({ children, id, ...props }: PlacesSearchProps) => {
  const listboxId = id ? `listbox-${id}` : "listbox";

  const context = {
    listboxId,
    ...props,
  };

  return (
    <PlacesSearchContext.Provider value={context}>
      <div className="relative">{children}</div>
    </PlacesSearchContext.Provider>
  );
};

interface PlacesSearchInputProps {
  placeholder: string;
  value: string;
  setValue: SetValue;
}

const PlacesSearchInput = forwardRef<HTMLInputElement, PlacesSearchInputProps>(
  ({ placeholder, value, setValue }, ref) => {
    const {
      listboxId,
      currIdx,
      setCurrIdx,
      selectedIdx,
      setSelectedIdx,
      onSelect,
    } = usePlacesSearchContext();
    const handleBlur = () => {
      setCurrIdx(null);
      if (selectedIdx === null) setValue("");
    };

    const handleFocus = () => {
      setCurrIdx(0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          if (currIdx === null) return;
          onSelect(currIdx);
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
          // hard-coded 4 because that is the max number of suggestions
          // provided by Google Maps Places API
          if (currIdx !== null && currIdx < 4) setCurrIdx(currIdx + 1);
          break;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value);
      setSelectedIdx(null);
    };

    return (
      <Input
        placeholder={placeholder}
        ref={ref}
        value={value}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        role="combobox"
        aria-autocomplete="list"
        aria-controls={`placesSearch-${listboxId}`}
        aria-expanded={currIdx !== null}
        aria-activedescendant={
          currIdx !== null
            ? `placesSearch-${listboxId}-option-${currIdx}`
            : undefined
        }
      />
    );
  },
);
PlacesSearchInput.displayName = "PlacesSearchInput";
PlacesSearch.Input = PlacesSearchInput;

const PlacesSearchListBox = () => {
  const className =
    "absolute my-1 w-full rounded-md border border-input bg-white p-3 text-sm shadow-md";
  const {
    listboxId,
    suggestions: { loading, status, data },
    currIdx,
    setCurrIdx,
    selectedIdx,
    onSelect,
  } = usePlacesSearchContext();

  const handlePointerMove = (idx: number) => () => {
    setCurrIdx(idx);
  };

  return (
    currIdx !== null &&
    status !== "" &&
    (loading ? (
      // TODO: change to shadcn skeleton
      <div role="progressbar" className={className}>
        Loading...
      </div>
    ) : status === "OK" ? (
      <div
        role="listbox"
        id={`placesSearch-${listboxId}`}
        onMouseDown={(e) => e.preventDefault()}
        className={cn(className, "p-1")}
      >
        {data.map((suggestion, idx) => (
          <div
            key={suggestion.place_id}
            id={`placesSearch-${listboxId}-option-${idx}`}
            onPointerMove={handlePointerMove(idx)}
            onClick={() => onSelect(idx)}
            role="option"
            aria-selected={currIdx === idx}
            className="flex cursor-pointer items-center rounded-md px-2 py-1.5 aria-selected:bg-accent aria-selected:text-accent-foreground"
          >
            <div className="flex flex-col">
              <span className="text-sm">
                {suggestion.structured_formatting.main_text}
              </span>
              <span className="text-xs">
                {suggestion.structured_formatting.secondary_text}
              </span>
            </div>
            {idx === selectedIdx && <CheckIcon className="ml-auto h-6 w-6" />}
          </div>
        ))}
      </div>
    ) : (
      <div role="presentation" className={className}>
        No results found.
      </div>
    ))
  );
};
PlacesSearch.ListBox = PlacesSearchListBox;

export { PlacesSearch };
