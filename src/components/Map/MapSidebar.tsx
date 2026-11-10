import { MapPinIcon } from "@heroicons/react/24/outline";
import type { Pact } from "../../types/Pact";
import type { LocationInfo } from "../../util/searchUtils";
import List from "../Results/List";
import Pill from "../Controls/Pill";
import Search from "../Search/Search";
import SearchInfo from "../Search/SearchInfo";
import SegmentedToggle from "../Controls/SegmentedToggle";
import { config } from "../../config/env";

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
      className="c-sidebar"
      aria-labelledby="map-sidebar-title"
    >
      <div className="c-sidebar__heading">
        <h1 id="map-sidebar-title" className="c-sidebar__title">
          Hitta lokala Föräldrapakter
        </h1>
      </div>
      <div>
        <div className="c-sidebar__controls">
          <Search
            onSearch={onSearch}
            onClear={onClearSearch}
            apiKey={config.googleApiKey!}
          />
          <div className="c-sidebar__actions">
            <button
              type="button"
              className="c-sidebar__location-button"
              onClick={onFindClosest}
            >
              <Pill>
                <MapPinIcon className="c-sidebar__location-icon" aria-hidden="true" /> Hitta andra nära mig
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
            className="u-visually-hidden"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {geolocationMessage}
          </p>
        </div>
      </div>
      <div className="c-sidebar__results">
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
