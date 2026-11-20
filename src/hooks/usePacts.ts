import { useEffect, useState } from "react";
import { config } from "../config/env";
import type { Pact, PactMunicipality } from "../types/Pact";
import { isPactApiResponse } from "../util/pactApi";

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
        if (!isPactApiResponse(data)) {
          setError("Unexpected API response format");
          setPacts([]);
          setMunicipalities([]);
          return;
        }

        const municipalities: PactMunicipality[] = data.municipalities.map(
          (municipality) => ({
            name: municipality.municipality,
            coordinates: municipality.coordinates,
            schools: (municipality.schools ?? []).map(
              (school): Pact => ({
                id: school.id,
                name: school.school,
                municipality: [municipality.municipality],
                school: school.school,
                coordinates: school.coordinates,
                studentCount: school.studentCount ?? 0,
                parentCount: school.parentCount ?? 0,
                contact: school.contact ?? undefined,
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