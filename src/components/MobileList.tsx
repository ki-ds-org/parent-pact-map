import type { Pact } from "../types/Pact";
import List from "./List";
import SearchInfo from "./SearchInfo";

interface MobileListProps {
  searchQuery: [number, number] | null;
  zooming: boolean;
  closestPacts: Pact[];
  filteredPacts: Pact[];
}

export default function MobileList({
  searchQuery,
  zooming,
  closestPacts,
  filteredPacts,
}: MobileListProps) {
  const results = closestPacts.length > 0 ? closestPacts : filteredPacts;
  const resultCount = results.length;
  const resultCountLabel = `${resultCount} ${
    resultCount === 1 ? "pakt" : "pakter"
  }`;
  const searchInfoDescription =
    searchQuery || zooming
      ? closestPacts.length > 0
        ? `Visar ${resultCountLabel} närmast dig.`
        : resultCount > 0
          ? `Visar ${resultCountLabel} i det här området.`
          : "Inga pakter hittades i området. Prova att flytta eller zooma kartan."
      : resultCount > 0
        ? `Visar ${resultCountLabel} i kartområdet. Flytta eller zooma kartan för att uppdatera resultaten.`
        : "Inga pakter visas i kartområdet. Flytta eller zooma kartan för att hitta pakter.";

  return (
    <section className="w-full bg-inherit pointer-events-auto border border-primary rounded-b-lg md:hidden" aria-label="Sökresultat">
      <SearchInfo
        title="Sökresultat"
        description={searchInfoDescription}
      />
      <List filteredPacts={results} />
    </section>
  );
}
