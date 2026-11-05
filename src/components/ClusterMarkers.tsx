import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import type { Pact } from "../types/Pact";
import { markerIcon } from "./markerIcon";

interface ClusterMarkersProps {
  coordinates: [Pact, [number, number]][];
  heatMetric: "students" | "parents";
}

function ClusterMarkers({ coordinates, heatMetric }: ClusterMarkersProps) {
  const map = useMap();

  useEffect(() => {
    const pactsByMarker = new WeakMap<L.Marker, Pact>();
    const markers = L.markerClusterGroup({
      iconCreateFunction: (cluster) => {
        const childMarkers = cluster.getAllChildMarkers();
        let total = childMarkers.reduce((sum, m) => {
          const pact = pactsByMarker.get(m);
          if (!pact) return sum + 1;
          const count =
            heatMetric === "parents" ? pact.parentCount : pact.studentCount;
          return sum + (count ?? 0);
        }, 0);
        if (total === 0 && childMarkers.length > 0) {
          total = cluster.getChildCount();
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

    const label =
      heatMetric === "parents"
        ? (n: number) => (n === 1 ? "förälder" : "föräldrar")
        : (n: number) => (n === 1 ? "elev" : "elever");

    coordinates.forEach(([pact, [lat, lng]]) => {
      const count =
        heatMetric === "parents" ? pact.parentCount : pact.studentCount;
      const marker = L.marker([lat, lng])
        .setIcon(markerIcon)
        .bindPopup(
          `<div class="text-sm">
          <div>${pact.name} (${count} ${label(count)})</div><div>
           <a href="https://ki-ds.org/foraldrapakten/ga-med">Gå med</a>
          </div></div>`
        );
      pactsByMarker.set(marker, pact);
      markers.addLayer(marker);
    });
    map.addLayer(markers);
    return () => {
      map.removeLayer(markers);
    };
  }, [coordinates, map, heatMetric]);

  return null;
}

export default ClusterMarkers;
