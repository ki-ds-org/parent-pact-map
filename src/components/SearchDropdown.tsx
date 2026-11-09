import type { SearchOption } from "../types/SearchTypes";

interface SearchDropdownProps {
  suggestions: SearchOption[];
  onSuggestionClick: (option: SearchOption) => void;
}

function SearchDropdown({
  suggestions,
  onSuggestionClick,
}: SearchDropdownProps) {
  if (suggestions.length === 0) {
    return <div className="p-2.5 text-center text-gray-600">No results</div>;
  }

  return (
    <>
      {suggestions.map((s) => {
        const key =
          s.kind === "municipality" ? s.municipality.name : s.pact.id;
        const label =
          s.kind === "municipality" ? s.municipality.name : s.pact.name;
        return (
          <div
            key={key}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSuggestionClick(s)}
            className="p-2.5 cursor-pointer border-b border-gray-600 text-sm hover:bg-background/60 transition-colors"
          >
            <div className="font-semibold">{label}</div>
            {s.kind === "school" && (
              <div className="text-xs text-gray-500">
                {s.pact.municipality[0]}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default SearchDropdown;
