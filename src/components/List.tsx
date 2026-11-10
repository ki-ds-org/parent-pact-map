import type { Pact } from "../types/Pact";
import ListItem from "./ListItem";
import noFoundImage from "../assets/not-found.avif";
import { getJoinUrl } from "../util/joinUrl";

interface ListProps {
  filteredPacts: Pact[];
}

function List({ filteredPacts }: ListProps) {
  return (
    <div className="w-full bg-inherit">
      <div className="">
        <ul aria-label="Föräldrapakter">
          {filteredPacts.map((pact, i) => {
            const parentLabel =
              pact.parentCount === 1 ? "förälder" : "föräldrar";
            const studentLabel = pact.studentCount === 1 ? "elev" : "elever";
            return (
              <ListItem
                key={`${pact.id}-${i}`}
                title={`${pact.name}`}
                description={`${pact.parentCount} ${parentLabel}, ${pact.studentCount} ${studentLabel}`}
                link={getJoinUrl(pact)}
                callToAction="Gå med"
              />
            );
          })}
        </ul>
        {filteredPacts.length === 0 && (
          <div className="text-center py-2 px-4">
            <div className="flex gap-4 mb-4">
              <div className="flex items-center justify-center">
                <img
                  src={noFoundImage}
                  alt=""
                  className="w-14 h-auto"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-left">
                  Det finns ännu ingen pakt här
                </h3>
                <p className="text-sm text-left font-light">
                  Men det finns garanterat likasinnade i ditt närområde. Bli den första familjen i ert område att vänta med smartphone – och hjälp fler familjer att göra samma val!
                </p>
              </div>
            </div>
            <div className="flex justify-center md:w-1/2 mx-auto">
              <a
                href="https://ki-ds.org/foraldrapakten/ga-med"
                className="pact-btn-link w-full block text-center px-4 py-1 text-sm rounded-3xl font-semibold bg-primary text-on-primary hover:bg-primary/80 transition-colors"
              >
                Skapa er lokala pakt!
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default List;
