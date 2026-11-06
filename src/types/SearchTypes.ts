import type { Pact, PactMunicipality } from "./Pact";

export type SearchOption =
  | {
      kind: "municipality";
      municipality: PactMunicipality;
    }
  | {
      kind: "school";
      pact: Pact;
    };