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
        const arr = Array.isArray(data) ? data : [];
        setPacts(arr as Pact[]);
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