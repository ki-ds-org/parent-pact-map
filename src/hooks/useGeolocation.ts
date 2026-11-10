import { useCallback } from "react";
import type { Pact } from "../types/Pact";
import { logInfo } from "../util/log";

interface GeolocationResult {
  pacts: Pact[];
}

export function useGeolocation() {
  const calculateDistance = useCallback((
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  const findClosestPacts = useCallback((
    pacts: Pact[],
    userLat: number,
    userLng: number,
    limit: number = 3,
    maxDistance: number = 80
  ): GeolocationResult => {
    const pactsWithDistances = pacts.map((pact) => {
      let minDistance = Infinity;
      if (pact.coordinates) {
        const distance = calculateDistance(
          userLat,
          userLng,
          pact.coordinates[0],
          pact.coordinates[1]
        );
        minDistance = distance;
      }

      return { pact, distance: minDistance };
    });

    const closestPacts = pactsWithDistances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .filter((pact) => {
        return pact.distance < maxDistance;
      })
      .map((item) => item.pact);

    logInfo("Closest pacts:", closestPacts);

    return { pacts: closestPacts };
  }, [calculateDistance]);

  return {
    findClosestPacts,
  };
} 