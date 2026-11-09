import classNames from "classnames";
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
  const listClass = classNames(
    "w-full overflow-y-scroll bg-inherit pointer-events-auto border border-primary rounded-b-lg md:hidden",
    {
      "h-[50vh] md:h-[100vh]": searchQuery || zooming,
      "h-[25vh] md:h-[100vh]": !searchQuery && !zooming,
    }
  );

  const searchInfoDescription =
    searchQuery || zooming
      ? closestPacts.length > 0
        ? `Visar de ${closestPacts.length} pakter som är närmast dig.`
        : `Visar ${
            filteredPacts.length > 1
              ? `${filteredPacts.length} pakter`
              : "1 pakt"
          }.`
      : `Visar alla ${filteredPacts.length} pakter i Sverige. Sök efter kommun för att hitta pakter nära dig.`;

  return (
    <div className={listClass}>
      <SearchInfo
        title="Sökresultat"
        description={filteredPacts.length > 0 ? searchInfoDescription : ""}
        fullHeight={!searchQuery && !zooming}
      />
      {searchQuery || zooming ? (
        <List
          filteredPacts={closestPacts.length > 0 ? closestPacts : filteredPacts}
        />
      ) : null}
    </div>
  );
}
