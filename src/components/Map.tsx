import classNames from "classnames";
import L from "leaflet";
import "leaflet.heat";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import { useCallback, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import useIsMobileView from "../hooks/useIsMobileView";
import { useMapData } from "../hooks/useMapData";
import "../plugins/BoundaryCanvas";
import type { Pact } from "../types/Pact";
import type { LocationInfo } from "../util/searchUtils";
import MapContainer from "./MapContainer";
import MapSidebar from "./MapSidebar";
import MobileList from "./MobileList";

// Extend Leaflet namespace to include markerClusterGroup
declare module "leaflet" {
  function markerClusterGroup(options?: any): any;
}

interface MapProps {
  pacts: Pact[];
}

function Map({ pacts }: MapProps) {
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<
    [Pact, [number, number]][]
  >([]);
  const [searchQuery, setSearchQuery] = useState<[number, number] | null>(null);
  const [zooming, setZooming] = useState(false);
  const [closestPacts, setClosestPacts] = useState<Pact[]>([]);
  const [currentLocationInfo, setCurrentLocationInfo] = useState<
    LocationInfo | undefined
  >();
  const [isProgrammaticZoom, setIsProgrammaticZoom] = useState(false);
  const [aggregation, setAggregation] = useState<"school" | "municipality">(
    "school"
  );
  const [geolocationMessage, setGeolocationMessage] = useState("");

  const isMobile = useIsMobileView();
  const { heatPoints, markerPoints, pacts: mapPacts } = useMapData(pacts, {
    aggregation,
  });
  const { findClosestPacts } = useGeolocation();

  const setMapViewWithLayoutDelay = useCallback(
    (
      coords: [number, number],
      triggerStateChange: () => void,
      afterLayoutChange?: () => void
    ) => {
      if (mapRef) {
        triggerStateChange();

        setTimeout(() => {
          if (mapRef) {
            setIsProgrammaticZoom(true); // Set flag before programmatic zoom
            mapRef.invalidateSize();
            mapRef.setView(coords, isMobile ? 10 : 11);
            afterLayoutChange?.();
          }
        }, 100);
      }
    },
    [mapRef, isMobile]
  );

  const handleSearch = (locationInfo: LocationInfo) => {
    // Find the closest pact to the searched location
    const { pacts: closestPacts } = findClosestPacts(
      mapPacts,
      locationInfo.coordinates[0],
      locationInfo.coordinates[1],
      1, // Only get the closest one
      50 // Within 50km of the search location
    );

    // Check if the closest pact's municipality matches the search query
    let targetCoords = locationInfo.coordinates;
    
    if (closestPacts.length > 0) {
      const closestPact = closestPacts[0];
      const searchMunicipality = locationInfo.municipality?.toLowerCase() || '';
      
      // Handle municipality as either string or array
      const pactMunicipality = Array.isArray(closestPact.municipality) 
        ? closestPact.municipality[0]?.toLowerCase() || ''
        : (closestPact.municipality as unknown as string)?.toLowerCase() || '';
      
      // Only snap to pact coordinates if municipality names match
      if (searchMunicipality && pactMunicipality && 
          (pactMunicipality.includes(searchMunicipality) || 
           searchMunicipality.includes(pactMunicipality))) {
        targetCoords = closestPact.coordinates;
      }
    }

    setMapViewWithLayoutDelay(targetCoords, () => {
      setSearchQuery(locationInfo.coordinates);
      setCurrentLocationInfo(locationInfo);
      setClosestPacts([]);
    });
  };

  const handleZooming = () => {
    if (isProgrammaticZoom) {
      setCurrentLocationInfo(undefined);
      setIsProgrammaticZoom(false);
    }

    setZooming(true);
    setClosestPacts([]);
  };

  const mapContainerClass = classNames(
    "w-full md:w-1/2 z-10 relative rounded-t-lg overflow-hidden",
    {
      "h-[50vh] md:h-[100vh]": searchQuery || zooming,
      "h-full": !searchQuery && !zooming,
    }
  );

  const getClosestPacts = useCallback(() => {
    if (!navigator.geolocation) {
      setGeolocationMessage("Din webbläsare stöder inte platsdelning.");
      return;
    }

    setGeolocationMessage("Hämtar din position...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const { pacts: closestPacts, closestSchool } = findClosestPacts(
          mapPacts,
          userLat,
          userLng,
          3,
          80
        );

        const targetCoords: [number, number] = closestSchool
          ? [closestSchool.coordinates[0], closestSchool.coordinates[1]]
          : [userLat, userLng];

        setMapViewWithLayoutDelay(
          targetCoords,
          () => {
            setZooming(true);
          },
          () => setClosestPacts(closestPacts)
        );
        setGeolocationMessage(
          closestPacts.length
            ? `Hittade ${closestPacts.length} närliggande pakter.`
            : "Hittade inga pakter inom 80 kilometer."
        );
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Platsåtkomst nekades. Tillåt platsåtkomst i webbläsaren för att hitta pakter nära dig."
            : error.code === error.POSITION_UNAVAILABLE
              ? "Din position kunde inte hämtas."
              : "Det tog för lång tid att hämta din position. Försök igen.";
        setGeolocationMessage(message);
      },
      { timeout: 10000 }
    );
  }, [mapPacts, findClosestPacts, setMapViewWithLayoutDelay]);

  // Filter pacts based on visible markers' pactIds
  const visiblePactIds = new Set(visibleMarkers.map(([pact]) => pact.id));
  const filteredPacts = mapPacts.filter((pact) => visiblePactIds.has(pact.id));

  return (
    <div className="flex h-full relative">
      <a
        href="#interactive-map"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[1000] focus:top-2 focus:left-2 focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2"
      >
        Hoppa till kartan
      </a>
      <div className="flex flex-1 flex-col md:flex-row w-full md:w-1/2 p-4 md:p-0">
        <MapSidebar
          onSearch={handleSearch}
          onFindClosest={getClosestPacts}
          searchQuery={searchQuery}
          zooming={zooming}
          closestPacts={closestPacts}
          filteredPacts={filteredPacts}
          currentLocationInfo={currentLocationInfo}
          geolocationMessage={geolocationMessage}
          aggregation={aggregation}
          onAggregationChange={setAggregation}
        />

        <div className={mapContainerClass}>
          <MapContainer
            heatPoints={heatPoints}
            markerPoints={markerPoints}
            onVisibleChange={setVisibleMarkers}
            onZoomStart={handleZooming}
            onMapRef={setMapRef}
            isMobile={isMobile}
          />
        </div>

        <MobileList
          searchQuery={searchQuery}
          zooming={zooming}
          closestPacts={closestPacts}
          filteredPacts={filteredPacts}
        />
      </div>
    </div>
  );
}

export default Map;
