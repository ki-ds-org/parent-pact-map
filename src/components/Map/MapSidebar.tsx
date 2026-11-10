import { MapPinIcon } from "@heroicons/react/24/outline";
import type { LocationInfo } from "../../util/searchUtils";
import Pill from "../Controls/Pill";
import Search from "../Search/Search";
import SegmentedToggle from "../Controls/SegmentedToggle";
import { config } from "../../config/env";
import MapViewTabs, { type MapView } from "./MapViewTabs";

interface MapSidebarProps {
  onSearch: (locationInfo: LocationInfo) => void;
  onClearSearch: () => void;
  onFindClosest: () => void;
  geolocationMessage: string;
  aggregation: "school" | "municipality";
  onAggregationChange: (mode: "school" | "municipality") => void;
  activeView: MapView;
  onViewChange: (view: MapView) => void;
}

export default function MapSidebar({
  onSearch,
  onClearSearch,
  onFindClosest,
  geolocationMessage,
  aggregation,
  onAggregationChange,
  activeView,
  onViewChange,
}: MapSidebarProps) {
  return (
    <aside
      className="c-sidebar"
      aria-labelledby="map-sidebar-title"
    >
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
          <MapViewTabs activeView={activeView} onChange={onViewChange} />
        </div>
      </div>
    </aside>
  );
}
