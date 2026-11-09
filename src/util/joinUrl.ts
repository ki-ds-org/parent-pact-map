import type { Pact } from "../types/Pact";

export function getJoinUrl(pact: Pact): string {
  const params = new URLSearchParams();
  if (pact.municipality[0]) {
    params.set("kommun", pact.municipality[0]);
  }
  if (pact.school) {
    params.set("skola", pact.school);
  }

  const query = params.toString();
  return `https://ki-ds.org/foraldrapakten/ga-med${query ? `?${query}` : ""}`;
}
