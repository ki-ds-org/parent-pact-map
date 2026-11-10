// VisibleMarkerTracker.tsx
import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import type { Pact } from "../../types/Pact";

interface VisibleMarkerTrackerProps {
  allMarkers: [Pact, [number, number]][];
  onVisibleChange: (visibleMarkers: [Pact, [number, number]][]) => void;
}

function VisibleMarkerTracker({
  allMarkers,
  onVisibleChange,
}: VisibleMarkerTrackerProps) {
  const map = useMap();
  const prevVisibleRef = useRef<string[]>([]); // track marker names
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const updateVisible = () => {
      const bounds = map.getBounds();

      const visible = allMarkers.filter(([, [lat, lng]]) =>
        bounds.contains([lat, lng])
      );
      const visibleNames = visible.map(([pact]) => pact.name).sort();

      const prevNames = prevVisibleRef.current;

      const hasChanged =
        visibleNames.length !== prevNames.length ||
        visibleNames.some((name, i) => name !== prevNames[i]);

      if (hasChanged) {
        prevVisibleRef.current = visibleNames;
        onVisibleChange(visible);
      }
    };

    const debouncedUpdate = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(updateVisible, 100);
    };

    updateVisible();
    map.on("moveend", debouncedUpdate);
    map.on("zoomend", debouncedUpdate);

    return () => {
      map.off("moveend", debouncedUpdate);
      map.off("zoomend", debouncedUpdate);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [map, allMarkers, onVisibleChange]);

  return null;
}

export default VisibleMarkerTracker;
