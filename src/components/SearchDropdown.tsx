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
    return <div className="c-search-dropdown__message" role="status">Laddar förslag...</div>;
  }

  if (suggestions.length === 0) {
    return <div className="c-search-dropdown__message">Inga förslag hittades.</div>;
  }

  return (
    <ul id="municipality-suggestions" role="listbox" className="c-search-dropdown">
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
            className="c-search-dropdown__option"
          >
            <div className="c-search-dropdown__primary">{primary}</div>
          </li>
        );
      })}
    </ul>
  );
}

export default SearchDropdown;
