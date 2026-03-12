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
  onFindClosest: () => void;
  searchQuery: [number, number] | null;
  zooming: boolean;
  closestPacts: Pact[];
  filteredPacts: Pact[];
  currentLocationInfo?: LocationInfo;
  heatMetric: "students" | "parents";
  aggregation: "school" | "municipality";
  onHeatMetricChange: (metric: "students" | "parents") => void;
  onAggregationChange: (mode: "school" | "municipality") => void;
}

export default function MapSidebar({
  onSearch,
  onFindClosest,
  searchQuery,
  zooming,
  closestPacts,
  filteredPacts,
  currentLocationInfo,
  heatMetric,
  aggregation,
  onHeatMetricChange,
  onAggregationChange,
}: MapSidebarProps) {
  const searchInfoDescription =
    searchQuery || zooming
      ? closestPacts.length > 0
        ? `Visar de ${closestPacts.length} pakter som är närmast dig.`
        : `Visar ${
            filteredPacts.length > 1
              ? `${filteredPacts.length} pakter`
              : "1 pakt"
          }.`
      : `Visar alla ${filteredPacts.length} pakter i Sverige. Sök efter kommun för att hitta pakter nära dig.`;

  return (
    <div className="w-full md:w-1/2 md:overflow-y-scroll">
      <div className="md:px-2">
        <h3 className="text-base font-semibold py-1">
          Hitta lokala Föräldrapakter
        </h3>
      </div>
      <div>
        <div className="w-full flex-1 md:flex-none flex flex-col md:p-2">
          <Search onSearch={onSearch} apiKey={config.googleApiKey!} />
          <div className="flex flex-wrap items-center justify-end gap-3 py-2 text-xs text-on-background pointer-events-auto">
            <button className="hover:bg-transparent" onClick={onFindClosest}>
              <Pill>
                <MapPinIcon className="w-4 h-4" /> Hitta andra nära mig
              </Pill>
            </button>
            <SegmentedToggle
              options={["students", "parents"]}
              value={heatMetric}
              onChange={onHeatMetricChange}
              labels={["Elever", "Föräldrar"]}
            />
            <SegmentedToggle
              options={["school", "municipality"]}
              value={aggregation}
              onChange={onAggregationChange}
              labels={["Skolor", "Kommuner"]}
            />
          </div>
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
          fullHeight={!searchQuery && !zooming}
        />
        {searchQuery || zooming ? (
          <List
            filteredPacts={
              closestPacts.length > 0 ? closestPacts : filteredPacts
            }
            heatMetric={heatMetric}
          />
        ) : null}
      </div>
    </div>
  );
}
