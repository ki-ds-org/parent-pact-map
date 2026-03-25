import { useEffect, useState } from "react";
import { config } from "../config/env";
import type { Pact } from "../types/Pact";

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
        if (!Array.isArray(data)) {
          setError("Unexpected API response format");
          setPacts([]);
          return;
        }
        // API returns [{municipality, schools:[{id, school, coordinates, ...}]}]
        // Flatten into the Pact shape expected by the rest of the app
        const pacts: Pact[] = (data as any[]).flatMap((muni: any) =>
          Array.isArray(muni.schools)
            ? muni.schools.map((school: any): Pact => ({
                id: school.id,
                name: school.school,
                municipality: [muni.municipality],
                coordinates: school.coordinates,
                studentCount: school.studentCount ?? 0,
                parentCount: school.parentCount ?? 0,
                contact: school.contact,
              }))
            : []
        );
        setPacts(pacts);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load pacts");
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