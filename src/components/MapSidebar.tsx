import { MapPinIcon } from "@heroicons/react/24/outline";
import type { Pact } from "../types/Pact";
import type { LocationInfo } from "../util/searchUtils";
import List from "./List";
import Pill from "./Pill";
import Search from "./Search";
import SearchInfo from "./SearchInfo";
import SegmentedToggle from "./SegmentedToggle";
import { config } from "../config/env";

interface MapSidebarProps {
  onSearch: (locationInfo: LocationInfo) => void;
  onClearSearch: () => void;
  onFindClosest: () => void;
  searchQuery: [number, number] | null;
  zooming: boolean;
  closestPacts: Pact[];
  filteredPacts: Pact[];
  currentLocationInfo?: LocationInfo;
  geolocationMessage: string;
  aggregation: "school" | "municipality";
  onAggregationChange: (mode: "school" | "municipality") => void;
}

export default function MapSidebar({
  onSearch,
  onClearSearch,
  onFindClosest,
  searchQuery,
  zooming,
  closestPacts,
  filteredPacts,
  currentLocationInfo,
  geolocationMessage,
  aggregation,
  onAggregationChange,
}: MapSidebarProps) {
  const results = closestPacts.length > 0 ? closestPacts : filteredPacts;
  const resultCount = results.length;
  const resultCountLabel = `${resultCount} ${
    resultCount === 1 ? "pakt" : "pakter"
  }`;
  const searchInfoDescription =
    searchQuery || zooming
      ? closestPacts.length > 0
        ? `Visar ${resultCountLabel} närmast dig.`
        : resultCount > 0
          ? `Visar ${resultCountLabel} i det här området.`
          : "Inga pakter hittades i området. Prova att flytta eller zooma kartan."
      : resultCount > 0
        ? `Visar ${resultCountLabel} i kartområdet. Flytta eller zooma kartan för att uppdatera resultaten.`
        : "Inga pakter visas i kartområdet. Flytta eller zooma kartan för att hitta pakter.";

  return (
    <aside
      className="w-full min-w-0 md:w-1/2"
      aria-labelledby="map-sidebar-title"
    >
      <div className="md:px-2">
        <h1 id="map-sidebar-title" className="text-base font-semibold py-1">
          Hitta lokala Föräldrapakter
        </h1>
      </div>
      <div>
        <div className="w-full flex-1 md:flex-none flex flex-col md:p-2">
          <Search
            onSearch={onSearch}
            onClear={onClearSearch}
            apiKey={config.googleApiKey!}
          />
          <div className="flex flex-wrap items-center justify-end gap-3 py-2 text-xs text-on-background pointer-events-auto">
            <button
              type="button"
              className="hover:bg-transparent"
              onClick={onFindClosest}
            >
              <Pill>
                <MapPinIcon className="w-4 h-4" aria-hidden="true" /> Hitta andra nära mig
              </Pill>
            </button>
            <SegmentedToggle
              options={["school", "municipality"]}
              value={aggregation}
              onChange={onAggregationChange}
              labels={["Skolor", "Kommuner"]}
            />
          </div>
          <p
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {geolocationMessage}
          </p>
        </div>
      </div>
      <div className="hidden md:block">
        <SearchInfo
          title={
            currentLocationInfo?.municipality && closestPacts.length < 1
              ? `Sökresultat "${currentLocationInfo.municipality} Kommun"`
              : "Sökresultat"
          }
          description={searchInfoDescription}
        />
        <List filteredPacts={results} />
      </div>
    </aside>
  );
}
