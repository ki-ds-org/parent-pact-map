import type { SearchOption } from "../../types/SearchTypes";

interface SearchDropdownProps {
  activeIndex: number;
  suggestions: SearchOption[];
  onSuggestionClick: (option: SearchOption) => void;
}

function SearchDropdown({
  activeIndex,
  suggestions,
  onSuggestionClick,
}: SearchDropdownProps) {
  if (suggestions.length === 0) {
    return (
      <div className="c-search-dropdown__message">
        Inga förslag hittades.
      </div>
    );
  }

  return (
    <ul id="municipality-suggestions" role="listbox" className="c-search-dropdown">
      {suggestions.map((option, index) => {
        const key =
          option.kind === "municipality"
            ? `municipality-${option.municipality.name}`
            : `school-${option.pact.id}`;
        const label =
          option.kind === "municipality"
            ? option.municipality.name
            : option.pact.name;
        const municipality =
          option.kind === "school" ? option.pact.municipality[0] : undefined;

        return (
          <li
            key={key}
            id={`municipality-option-${index}`}
            role="option"
            aria-selected={activeIndex === index}
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onSuggestionClick(option);
            }}
            className="c-search-dropdown__option"
          >
            <div className="c-search-dropdown__primary">{label}</div>
            {municipality && (
              <div className="c-search-dropdown__secondary">{municipality}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default SearchDropdown;
