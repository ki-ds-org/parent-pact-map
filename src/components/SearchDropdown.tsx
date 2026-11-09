import type { Suggestion } from "../types/SearchTypes";

interface SearchDropdownProps {
  activeIndex: number;
  isLoading: boolean;
  suggestions: Suggestion[];
  onSuggestionClick: (s: Suggestion) => void;
}

function SearchDropdown({
  activeIndex,
  isLoading,
  suggestions,
  onSuggestionClick,
}: SearchDropdownProps) {
  if (isLoading) {
    return <div className="p-2.5 text-center" role="status">Laddar förslag...</div>;
  }

  if (suggestions.length === 0) {
    return <div className="p-2.5 text-center">Inga förslag hittades.</div>;
  }

  return (
    <ul id="municipality-suggestions" role="listbox" className="list-none">
      {suggestions.map((s, index) => {
        const key =
          s.placePrediction?.placeId ??
          s.placePrediction?.text.toString() ??
          "";
        const primary = s.placePrediction?.text.toString() ?? "";
        return (
          <li
            key={key}
            id={`municipality-option-${index}`}
            role="option"
            aria-selected={activeIndex === index}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSuggestionClick(s)}
            className={`p-2.5 cursor-pointer border-b border-gray-600 text-sm hover:bg-background/60 transition-colors ${
              activeIndex === index ? "bg-background/60" : ""
            }`}
          >
            <div className="font-semibold">{primary}</div>
          </li>
        );
      })}
    </ul>
  );
}

export default SearchDropdown;
