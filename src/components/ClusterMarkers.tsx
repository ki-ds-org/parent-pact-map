import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Pact } from "../types/Pact";

interface ClusterMarkersProps {
  coordinates: [Pact, [number, number]][];
  heatMetric: "students" | "parents";
}

export const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function ClusterMarkers({ coordinates, heatMetric }: ClusterMarkersProps) {
  const map = useMap();
  const heatMetricRef = useRef(heatMetric);
  const clusterGroupRef = useRef<
    ReturnType<typeof L.markerClusterGroup> | null
  >(null);
  const previousHeatMetricRef = useRef(heatMetric);
  heatMetricRef.current = heatMetric;

  useEffect(() => {
    if (previousHeatMetricRef.current === heatMetric) return;

    previousHeatMetricRef.current = heatMetric;
    clusterGroupRef.current?.refreshClusters();
  }, [heatMetric]);

  useEffect(() => {
    const markers = L.markerClusterGroup({
      iconCreateFunction: (cluster: any) => {
        const childMarkers = cluster.getAllChildMarkers?.() ?? [];
        let total = childMarkers.reduce((sum: number, m: any) => {
          const pact = m._pact as Pact | undefined;
          if (!pact) return sum + 1;
          const count =
            heatMetricRef.current === "parents"
              ? pact.parentCount
              : pact.studentCount;
          return sum + (count ?? 0);
        }, 0);
        if (total === 0 && childMarkers.length > 0) {
          total = cluster.getChildCount?.() ?? childMarkers.length;
        }

        let color = "#808080";
        if (total >= 50) {
          color = "#5e5e5e";
        } else if (total >= 20) {
          color = "#757575";
        }

        return L.divIcon({
          html: `<div class="map-marker-cluster" style="background:${color};">
                       <span>${total}</span>
                     </div>`,
          className: "leaflet-marker-cluster",
          iconSize: [40, 40],
        });
      },
      showCoverageOnHover: false,
    });

    coordinates.forEach(([pact, [lat, lng]]) => {
      const marker = L.marker([lat, lng])
        .setIcon(markerIcon)
        .bindPopup(() => {
          const currentMetric = heatMetricRef.current;
          const count =
            currentMetric === "parents" ? pact.parentCount : pact.studentCount;
          const label =
            currentMetric === "parents"
              ? count === 1
                ? "förälder"
                : "föräldrar"
              : count === 1
                ? "elev"
                : "elever";

          return `<div class="text-sm">
          <div>${pact.name} (${count} ${label})</div><div>
           <a href="https://ki-ds.org/foraldrapakten/ga-med">Gå med</a>
          </div></div>`;
        });
      (marker as any)._pact = pact;
      markers.addLayer(marker);
    });
    clusterGroupRef.current = markers;
    map.addLayer(markers);
    return () => {
      map.removeLayer(markers);
      clusterGroupRef.current = null;
    };
  }, [coordinates, map]);

  return null;
}

export default ClusterMarkers;
