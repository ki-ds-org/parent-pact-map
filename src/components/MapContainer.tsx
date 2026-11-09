import L from "leaflet";
import { useEffect, useRef } from "react";
import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import type { Pact } from "../types/Pact";
import ClusterMarkers from "./ClusterMarkers";
import HeatmapLayer from "./HeatmapLayer";
import VisibleMarkerTracker from "./VisibleMarkerTracker";
import ZoomStartListener from "./ZoomStartListener";

interface MapContainerProps {
  heatPoints: [number, number, number][];
  markerPoints: [Pact, [number, number]][];
  onVisibleChange: (markers: [Pact, [number, number]][]) => void;
  onZoomStart: () => void;
  onMapRef: (map: L.Map | null) => void;
  isMobile: boolean;
}

export default function MapContainer({
  heatPoints,
  markerPoints,
  onVisibleChange,
  onZoomStart,
  onMapRef,
  isMobile,
}: MapContainerProps) {
  const mapRef = useRef<L.Map>(null);

  // Pass map reference to parent when it changes
  useEffect(() => {
    if (mapRef.current) {
      onMapRef(mapRef.current);
    } else {
      // If map is not ready yet, try again after a short delay
      const timer = setTimeout(() => {
        if (mapRef.current) {
          onMapRef(mapRef.current);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  });

  return (
    <LeafletMapContainer
      center={[62.0, 10.0]} // Centered over Sweden
      zoom={isMobile ? 4 : 5}
      maxBounds={[
        [54.5, 7.5],
        [69.5, 25.5],
      ]} // Rough bounding box for Sweden
      minZoom={4}
      maxZoom={15}
      maxBoundsViscosity={1.0}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors &amp; Geoapify"
        url="https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=c7be631f429d488f953709566022593d"
      />
      <HeatmapLayer points={heatPoints} />
      <ClusterMarkers coordinates={markerPoints} />
      <VisibleMarkerTracker
        allMarkers={markerPoints}
        onVisibleChange={onVisibleChange}
      />
      <ZoomStartListener onZoomStart={onZoomStart} />
    </LeafletMapContainer>
  );
}
