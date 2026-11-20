import type { Pact } from "../../types/Pact";
import ListItem from "./ListItem";
import { getJoinUrl } from "../../util/joinUrl";

interface ListProps {
  filteredPacts: Pact[];
}

function List({ filteredPacts }: ListProps) {
  return (
    <div className="c-results">
      <div className="c-results__list">
        <ul className="c-results__items" aria-label="Föräldrapakter">
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
          <div className="c-results__empty">
            <div className="c-results__empty-content">
              <div className="c-results__empty-copy">
                <p className="c-results__empty-description">
                  Hittar du ingen pakt där du bor? Då kan ni bli först med att starta en! 
                  Bli den första familjen i ert område som väljer att vänta med smartphone – och hjälp fler familjer att göra samma val!
                </p>
              </div>
            </div>
            <div className="c-results__empty-action">
              <a
                href="https://ki-ds.org/foraldrapakten/ga-med"
                className="c-button"
              >
                Skapa en lokal pakt
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default List;
