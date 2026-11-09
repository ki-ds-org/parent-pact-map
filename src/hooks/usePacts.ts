import { useEffect, useState } from "react";
import { config } from "../config/env";
import type { Pact, PactMunicipality } from "../types/Pact";

type ApiSchool = {
  id: string;
  school: string;
  coordinates: [number, number];
  studentCount?: number;
  parentCount?: number;
  contact?: string;
};

type ApiMunicipality = {
  municipality: string;
  coordinates: [number, number];
  schools?: ApiSchool[];
};

function isCoordinates(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate))
  );
}

function isApiMunicipality(value: unknown): value is ApiMunicipality {
  return (
    typeof value === "object" &&
    value !== null &&
    "municipality" in value &&
    typeof value.municipality === "string" &&
    "coordinates" in value &&
    isCoordinates(value.coordinates) &&
    (!("schools" in value) || Array.isArray(value.schools))
  );
}

function isApiSchool(value: unknown): value is ApiSchool {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "school" in value &&
    typeof value.school === "string" &&
    "coordinates" in value &&
    isCoordinates(value.coordinates)
  );
}

function usePacts(): {
  pacts: Pact[];
  municipalities: PactMunicipality[];
  loading: boolean;
  error: string | null;
  retry: () => void;
} {
  const [pacts, setPacts] = useState<Pact[]>([]);
  const [municipalities, setMunicipalities] = useState<PactMunicipality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPacts = () => {
    setLoading(true);
    setError(null);

    fetch(config.pactsApiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: unknown) => {
        if (
          typeof data !== "object" ||
          data === null ||
          !("municipalities" in data) ||
          !Array.isArray(data.municipalities)
        ) {
          setError("Unexpected API response format");
          setPacts([]);
          setMunicipalities([]);
          return;
        }

        const apiMunicipalities = data.municipalities.filter(isApiMunicipality);
        const municipalities: PactMunicipality[] = apiMunicipalities.map(
          (municipality) => ({
            name: municipality.municipality,
            coordinates: municipality.coordinates,
            schools: (municipality.schools ?? [])
              .filter(isApiSchool)
              .map(
                (school): Pact => ({
                  id: school.id,
                  name: school.school,
                  municipality: [municipality.municipality],
                  coordinates: school.coordinates,
                  studentCount: school.studentCount ?? 0,
                  parentCount: school.parentCount ?? 0,
                  contact: school.contact,
                })
              ),
          })
        );
        const pacts = municipalities.flatMap((municipality) => municipality.schools);

        setPacts(pacts);
        setMunicipalities(municipalities);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to load pacts"
        );
        setPacts([]);
        setMunicipalities([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPacts();
  }, []);

  return { pacts, municipalities, loading, error, retry: fetchPacts };
}

export default usePacts;