import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface HeatmapLayerProps {
  points: [number, number, number?][];
}

function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    const heatLayer = L.heatLayer(points, {
      radius: 10,
      max: 1,
      minOpacity: 0.4,
    }).addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

export default HeatmapLayer;
