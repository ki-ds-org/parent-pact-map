import { useEffect, useMemo, useRef, useState } from "react";
import type { PactMunicipality } from "../../types/Pact";
import type { SearchOption } from "../../types/SearchTypes";
import type { LocationInfo } from "../../util/searchUtils";
import Button from "../Controls/Button";
import SearchDropdown from "./SearchDropdown";

interface SearchProps {
  onSearch: (locationInfo: LocationInfo) => void;
  onClear: () => void;
  municipalities: PactMunicipality[];
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("sv")
    .replace(/(?<![\p{L}\p{N}])(?:kommunen|kommun|stad)(?![\p{L}\p{N}])/gu, "")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function municipalityNamesMatch(first: string, second: string) {
  const normalizedFirst = normalize(first);
  const normalizedSecond = normalize(second);
  return (
    normalizedFirst === normalizedSecond ||
    normalizedFirst === `${normalizedSecond}s` ||
    normalizedSecond === `${normalizedFirst}s`
  );
}

function municipalityMatchesQuery(name: string, query: string) {
  return (
    normalize(name).includes(normalize(query)) ||
    municipalityNamesMatch(name, query)
  );
}

function Search({ onSearch, onClear, municipalities }: SearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [searchMessage, setSearchMessage] = useState("");
  const normalizedQuery = normalize(query.trim());
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const root = searchRef.current;
      if (root && !event.composedPath().includes(root)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const suggestions = useMemo((): SearchOption[] => {
    if (normalizedQuery.length < 2) return [];

    const options: SearchOption[] = [];
    for (const municipality of municipalities) {
      const matchesMunicipality = municipalityMatchesQuery(
        municipality.name,
        normalizedQuery
      );
      const matchingSchools = municipality.schools.filter((school) =>
        normalize(school.name).includes(normalizedQuery)
      );

      if (matchesMunicipality) {
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
            item.schools.some((school) => school.id === option.pact.id)
          );
    const coordinates =
      option.kind === "municipality"
        ? option.municipality.coordinates
        : option.pact.coordinates;
    const municipalityName =
      option.kind === "municipality"
        ? option.municipality.name
        : (municipality?.name ?? option.pact.municipality[0]);
    const label =
      option.kind === "municipality"
        ? option.municipality.name
        : option.pact.name;

    onSearch({
      coordinates,
      municipality: municipalityName,
      formattedAddress: label,
    });
    setQuery(label);
    setSelectedSchoolId(
      option.kind === "school" ? option.pact.id : null
    );
    setSearchMessage(`Visar resultat för ${label}.`);
    setActiveIndex(-1);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedSchoolId(null);
    setActiveIndex(-1);
    setSearchMessage("");
    onClear();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectOption(suggestions[activeIndex]);
      return;
    }

    if (selectedSchoolId) {
      const selectedSchool = municipalities
        .flatMap((municipality) => municipality.schools)
        .find((school) => school.id === selectedSchoolId);
      if (selectedSchool) {
        selectOption({ kind: "school", pact: selectedSchool });
        return;
      }
    }

    const exactMatches = suggestions.filter((option) =>
      option.kind === "municipality"
        ? municipalityNamesMatch(option.municipality.name, query.trim())
        : normalize(option.pact.name) === normalizedQuery
    );
    if (exactMatches.length === 1) selectOption(exactMatches[0]);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1
      );
    } else if (event.key === "Escape") {
      setIsFocused(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={searchRef} className="c-search">
      <form
        onSubmit={handleSubmit}
        className="c-search__form"
        aria-label="Sök efter kommun"
      >
        <div className="c-search__field">
          <label htmlFor="municipality-search" className="u-visually-hidden">
            Sök efter kommun
          </label>
          <input
            id="municipality-search"
            type="search"
            placeholder="Sök efter kommun"
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              if (!nextQuery) {
                handleClear();
                return;
              }
              setQuery(nextQuery);
              setSelectedSchoolId(null);
              setSearchMessage("");
              setActiveIndex(-1);
              setIsFocused(true);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleInputKeyDown}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isFocused && normalizedQuery.length >= 2}
            aria-controls={
              isFocused && normalizedQuery.length >= 2
                ? "municipality-suggestions"
                : undefined
            }
            aria-activedescendant={
              activeIndex >= 0 ? `municipality-option-${activeIndex}` : undefined
            }
            className="c-search__input"
          />

          {isFocused && normalizedQuery.length >= 2 && (
            <div className="c-search__dropdown">
              <SearchDropdown
                activeIndex={activeIndex}
                suggestions={suggestions}
                onSuggestionClick={selectOption}
              />
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="search"
          disabled={!query.trim()}
        >
          Sök
        </Button>
      </form>
      <p
        className="u-visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {searchMessage}
      </p>
    </div>
  );
}

export default Search;
