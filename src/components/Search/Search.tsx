import { useEffect, useRef, useState } from "react";
import Button from "../Controls/Button";
import { useDebounce } from "../../hooks/useDebounce";
import { useGoogleMapsInit } from "../../hooks/useGoogleMapsInit";
import {
  resolveSuggestionToCoords,
  geocodeAddress,
  type LocationInfo,
} from "../../util/searchUtils";
import { fetchSuggestions } from "../../util/suggestionsFetcher";
import { MIN_QUERY_LENGTH, DEBOUNCE_DELAY } from "../../config/searchConfig";
import type { Suggestion } from "../../types/SearchTypes";
import SearchDropdown from "./SearchDropdown";

interface SearchProps {
  onSearch: (locationInfo: LocationInfo) => void;
  onClear: () => void;
  apiKey?: string;
}

function Search({ onSearch, onClear, apiKey }: SearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchMessage, setSearchMessage] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { geocoderRef, sessionTokenRef, isGoogleMapsLoaded } = useGoogleMapsInit(apiKey);
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  const suggestionsCache = useRef(new Map<string, Suggestion[]>());

  const geocodeCache = useRef(new Map<string, LocationInfo>());

  const limitCacheSize = <K, V>(cache: Map<K, V>, maxSize: number) => {
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
      }
    }
  };

  useEffect(() => {
    if (!isGoogleMapsLoaded) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
      return;
    }

    if (!debouncedQuery || debouncedQuery.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setShowDropdown(false);
      setActiveIndex(-1);
      return;
    }

    setIsLoading(true);
    setShowDropdown(false);

    const getSuggestions = async () => {
      const municipalitySearch = debouncedQuery.toLowerCase().includes("kommun")
        ? debouncedQuery
        : `${debouncedQuery} kommun`;

      const cached = suggestionsCache.current.get(municipalitySearch);
      if (cached) {
        setSuggestions(cached);
        setShowDropdown(cached.length > 0 && isFocused);
        setActiveIndex(-1);
        setIsLoading(false);
        return;
      }

      try {
        const newSuggestions = await fetchSuggestions(
          municipalitySearch,
          sessionTokenRef.current
        );

        const filteredSuggestions = newSuggestions.filter(
          (s) =>
            !s.placePrediction?.text
              .toString()
              .toLowerCase()
              .includes("kommune")
        );

        suggestionsCache.current.set(municipalitySearch, filteredSuggestions);

        limitCacheSize(suggestionsCache.current, 20);

        setSuggestions(filteredSuggestions);
        setShowDropdown(filteredSuggestions.length > 0 && isFocused);
        setActiveIndex(-1);
      } catch (err) {
        console.error("AutocompleteSuggestion error", err);
        setSuggestions([]);
        setShowDropdown(false);
        setSearchMessage("Förslagen kunde inte hämtas. Försök igen.");
      } finally {
        setIsLoading(false);
      }
    };

    getSuggestions();
  }, [debouncedQuery, isFocused, isGoogleMapsLoaded, sessionTokenRef]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGoogleMapsLoaded || !query.trim()) return;

    const trimmedQuery = query.trim();
    setSearchMessage("");

    const cachedLocation = geocodeCache.current.get(trimmedQuery);
    if (cachedLocation) {
      onSearch(cachedLocation);
      setShowDropdown(false);
      sessionTokenRef.current =
        new google.maps.places.AutocompleteSessionToken();
      return;
    }

    setIsLoading(true);
    try {
      const locationInfo = await geocodeAddress(
        trimmedQuery,
        geocoderRef.current
      );

      if (locationInfo) {
        geocodeCache.current.set(trimmedQuery, locationInfo);
        limitCacheSize(geocodeCache.current, 10);
        onSearch(locationInfo);
        setShowDropdown(false);
        sessionTokenRef.current =
          new google.maps.places.AutocompleteSessionToken();
        setSearchMessage(`Visar resultat för ${trimmedQuery}.`);
      } else {
        setSearchMessage("Hittade ingen plats i Sverige. Kontrollera sökningen.");
      }
    } catch (err) {
      console.error("Geocoding error", err);
      setSearchMessage("Sökningen misslyckades. Försök igen.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (s: Suggestion) => {
    if (!isGoogleMapsLoaded) return;

    const label = s.placePrediction?.text.toString() ?? "";
    setQuery(label);
    setShowDropdown(false);
    setIsFocused(false);
    setSearchMessage("");
    setIsLoading(true);
    try {
      const locationInfo = await resolveSuggestionToCoords(s);
      if (locationInfo) {
        onSearch(locationInfo);
        sessionTokenRef.current =
          new google.maps.places.AutocompleteSessionToken();
        setSearchMessage(`Visar resultat för ${label}.`);
      } else {
        setSearchMessage("Kunde inte hitta den valda platsen. Försök igen.");
      }
    } catch (err) {
      console.error("Place lookup error", err);
      setSearchMessage("Sökningen misslyckades. Försök igen.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    setActiveIndex(-1);
    setSearchMessage("");
    onClear();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault();
      setShowDropdown(true);
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1
      );
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      void handleSuggestionClick(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={dropdownRef} className="c-search">
      <form
        onSubmit={handleSearch}
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
            onChange={(e) => {
              if (!e.target.value) {
                handleClear();
                return;
              }
              setQuery(e.target.value);
              setSearchMessage("");
              setActiveIndex(-1);
              setShowDropdown(false);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleInputKeyDown}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-controls={
              showDropdown ? "municipality-suggestions" : undefined
            }
            aria-activedescendant={
              activeIndex >= 0 ? `municipality-option-${activeIndex}` : undefined
            }
            className="c-search__input"
          />

          {showDropdown && (
            <div className="c-search__dropdown">
              <SearchDropdown
                activeIndex={activeIndex}
                isLoading={isLoading}
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="search"
          disabled={isLoading || !isGoogleMapsLoaded}
        >
          Sök
        </Button>
      </form>
      <p className="u-visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {isLoading ? "Söker..." : searchMessage}
      </p>
    </div>
  );
}

export default Search;
