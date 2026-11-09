import { useMemo, useState } from "react";
import type { PactMunicipality } from "../types/Pact";
import type { SearchOption } from "../types/SearchTypes";
import type { LocationInfo } from "../util/searchUtils";
import Button from "./Button";
import SearchDropdown from "./SearchDropdown";

interface SearchProps {
  onSearch: (locationInfo: LocationInfo) => void;
  municipalities: PactMunicipality[];
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("sv")
    .replace(/s stad\b/gu, "")
    .replace(/\b(kommun(en)?|stad)\b/gu, "")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function municipalityMatches(first: string, second: string) {
  const normalizedFirst = normalize(first);
  const normalizedSecond = normalize(second);
  return (
    normalizedFirst === normalizedSecond ||
    normalizedFirst === `${normalizedSecond}s` ||
    normalizedSecond === `${normalizedFirst}s`
  );
}

function Search({ onSearch, municipalities }: SearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const normalizedQuery = normalize(query.trim());

  const suggestions = useMemo((): SearchOption[] => {
    if (normalizedQuery.length < 2) return [];

    const options: SearchOption[] = [];
    for (const municipality of municipalities) {
      const municipalityMatchesQuery = normalize(municipality.name).includes(
        normalizedQuery
      );
      const matchingSchools = municipality.schools.filter((school) =>
        normalize(school.name).includes(normalizedQuery)
      );

      if (municipalityMatchesQuery) {
        options.push({ kind: "municipality", municipality });
        options.push(
          ...municipality.schools.map((pact) => ({
            kind: "school" as const,
            pact,
          }))
        );
      } else {
        options.push(
          ...matchingSchools.map((pact) => ({
            kind: "school" as const,
            pact,
          }))
        );
      }
    }

    return options;
  }, [municipalities, normalizedQuery]);

  const selectOption = (option: SearchOption) => {
    const municipality =
      option.kind === "municipality"
        ? option.municipality
        : municipalities.find((item) =>
            municipalityMatches(item.name, option.pact.municipality[0] ?? "")
          );
    const coordinates =
      option.kind === "municipality"
        ? option.municipality.coordinates
        : option.pact.coordinates;

    onSearch({
      coordinates,
      municipality:
        option.kind === "municipality"
          ? option.municipality.name
          : (municipality?.name ?? option.pact.municipality[0]),
      formattedAddress:
        option.kind === "municipality"
          ? option.municipality.name
          : option.pact.name,
    });
    setQuery(
      option.kind === "municipality"
        ? option.municipality.name
        : option.pact.name
    );
    setIsFocused(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = normalize(query.trim());
    const exactMatch = suggestions.find((option) =>
      option.kind === "municipality"
        ? normalize(option.municipality.name) === normalized
        : normalize(option.pact.name) === normalized
    );
    if (exactMatch) selectOption(exactMatch);
  };

  return (
    <div className="relative z-50 w-full pointer-events-auto">
      <form onSubmit={handleSubmit} className="flex flex-row gap-2">
        <div className="relative flex-1 w-80">
          <input
            type="text"
            placeholder="Sök efter kommun"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsFocused(true);
            }}
            onClick={() => setIsFocused(true)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-2 text-sm border border-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 text-white rounded-lg"
          />
          {isFocused && normalizedQuery.length >= 2 && (
            <div className="absolute top-full left-0 right-0 bg-background border border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
              <SearchDropdown
                suggestions={suggestions}
                onSuggestionClick={selectOption}
              />
            </div>
          )}
        </div>
        <Button type="submit" variant="primary" disabled={!query.trim()}>
          Sök
        </Button>
      </form>
    </div>
  );
}

export default Search;
