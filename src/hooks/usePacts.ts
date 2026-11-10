import { useEffect, useState } from "react";
import { config } from "../config/env";
import type { Pact } from "../types/Pact";

interface PactApiSchool {
  id: string;
  school: string;
  coordinates: [number, number];
  studentCount?: number;
  parentCount?: number;
  contact?: string;
}

interface PactApiMunicipality {
  municipality: string;
  schools?: PactApiSchool[];
}

interface PactApiResponse {
  municipalities: PactApiMunicipality[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSchool(value: unknown): value is PactApiSchool {
  if (!isRecord(value)) return false;
  const coordinates = value.coordinates;
  return (
    typeof value.id === "string" &&
    typeof value.school === "string" &&
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    coordinates.every((coordinate) => typeof coordinate === "number") &&
    (value.studentCount === undefined ||
      typeof value.studentCount === "number") &&
    (value.parentCount === undefined || typeof value.parentCount === "number") &&
    (value.contact === undefined || typeof value.contact === "string")
  );
}

function isMunicipality(value: unknown): value is PactApiMunicipality {
  if (!isRecord(value)) return false;
  return (
    typeof value.municipality === "string" &&
    (value.schools === undefined ||
      (Array.isArray(value.schools) && value.schools.every(isSchool)))
  );
}

function isPactApiResponse(value: unknown): value is PactApiResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.municipalities) &&
    value.municipalities.every(isMunicipality)
  );
}

function usePacts(): {
  pacts: Pact[];
  loading: boolean;
  error: string | null;
  retry: () => void;
} {
  const [pacts, setPacts] = useState<Pact[]>([]);
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
        if (!isPactApiResponse(data)) {
          setError("Unexpected API response format");
          setPacts([]);
          return;
        }

        // API returns {
        //   totalCount,
        //   signupsPastSevenDays,
        //   municipalities: [{ municipality, schools: [...] }]
        // }
        // Flatten municipalities and schools into the Pact shape
        // expected by the rest of the app.
        const pacts: Pact[] = data.municipalities.flatMap(
          (muni) =>
            muni.schools?.map((school): Pact => ({
                  id: school.id,
                  name: school.school,
                  municipality: [muni.municipality],
                  school: school.school,
                  coordinates: school.coordinates,
                  studentCount: school.studentCount ?? 0,
                  parentCount: school.parentCount ?? 0,
                  contact: school.contact,
                })) ?? []
        );

        setPacts(pacts);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to load pacts"
        );
        setPacts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPacts();
  }, []);

  return { pacts, loading, error, retry: fetchPacts };
}

export default usePacts;