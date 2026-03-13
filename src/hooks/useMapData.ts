import { useMemo } from "react";
import type { Pact } from "../types/Pact";

export type HeatMetric = "students" | "parents";
export type AggregationMode = "school" | "municipality";

type UseMapDataOptions = {
  heatMetric?: HeatMetric;
  aggregation?: AggregationMode;
};

function aggregateByMunicipality(pacts: Pact[]): Pact[] {
  type Acc = {
    id: string;
    name: string;
    municipality: string[];
    latSum: number;
    lngSum: number;
    count: number;
    studentCount: number;
    parentCount: number;
  };

  const groups = new Map<string, Acc>();

  for (const pact of pacts) {
    const coords = pact.coordinates;
    if (
      !Array.isArray(coords) ||
      !Number.isFinite(coords[0]) ||
      !Number.isFinite(coords[1])
    ) {
      continue;
    }

    const municipalityName = Array.isArray(pact.municipality)
      ? pact.municipality[0] ?? "Okänd kommun"
      : (pact.municipality as unknown as string) ?? "Okänd kommun";

    const key = municipalityName;
    const existing = groups.get(key);

    if (existing) {
      existing.latSum += coords[0];
      existing.lngSum += coords[1];
      existing.count += 1;
      existing.studentCount += pact.studentCount ?? 0;
      existing.parentCount += pact.parentCount ?? 0;
    } else {
      groups.set(key, {
        id: key,
        name: municipalityName,
        municipality: [municipalityName],
        latSum: coords[0],
        lngSum: coords[1],
        count: 1,
        studentCount: pact.studentCount ?? 0,
        parentCount: pact.parentCount ?? 0,
      });
    }
  }

  const aggregated: Pact[] = [];

  for (const acc of groups.values()) {
    aggregated.push({
      id: acc.id,
      name: acc.name,
      municipality: acc.municipality,
      coordinates: [acc.latSum / acc.count, acc.lngSum / acc.count],
      studentCount: acc.studentCount,
      parentCount: acc.parentCount,
      contact: undefined,
    });
  }

  return aggregated;
}

export function useMapData(
  pacts: Pact[],
  options: UseMapDataOptions = {}
) {
  const { heatMetric = "students", aggregation = "school" } = options;

  const sourcePacts = useMemo(
    () =>
      aggregation === "municipality"
        ? aggregateByMunicipality(pacts)
        : pacts,
    [aggregation, pacts]
  );

  const validPacts = useMemo(
    () =>
      sourcePacts.filter(
        (pact) =>
          Array.isArray(pact.coordinates) &&
          Number.isFinite(pact.coordinates[0]) &&
          Number.isFinite(pact.coordinates[1])
      ),
    [sourcePacts]
  );

  const heatPoints = useMemo(
    () =>
      validPacts.map(
        (pact) =>
          [
            pact.coordinates[0],
            pact.coordinates[1],
            heatMetric === "parents"
              ? pact.parentCount
              : pact.studentCount,
          ] as [number, number, number]
      ),
    [validPacts, heatMetric]
  );

  const markerPoints = useMemo(
    () =>
      validPacts.map(
        (pact) =>
          [pact, [pact.coordinates[0], pact.coordinates[1]]] as [
            Pact,
            [number, number]
          ]
      ),
    [validPacts]
  );

  return {
    pacts: validPacts,
    heatPoints,
    markerPoints,
  };
}

// TODO: Add schools back in when data is available
// export function useMapDataWithSchools(pacts: Pact[]) {
//   const allSchools = useMemo(() => 
//     pacts.flatMap((pact) =>
//       pact.schools
//         .filter((school) => school.coordinates)
//         .map((school) => ({ ...school, pact }))
//     ), [pacts]);

//   const heatPoints = useMemo(() => 
//     allSchools.map((school) => [
//       school.coordinates[0],
//       school.coordinates[1],
//       school.studentCount,
//     ] as [number, number, number]), [allSchools]);

//   const markerPoints = useMemo(() => 
//     allSchools.map((school) => [
//       school, 
//       [school.coordinates[0], school.coordinates[1]]
//     ] as [School, [number, number]]), [allSchools]);

//   return {
//     allSchools,
//     heatPoints,
//     markerPoints,
//   };
// } 