import type { Pact } from "../../types/Pact";
import ListItem from "./ListItem";
import noFoundImage from "../../assets/not-found.avif";
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
              <div className="c-results__empty-image-wrap">
                <img
                  src={noFoundImage}
                  alt=""
                  className="c-results__empty-image"
                />
              </div>
              <div className="c-results__empty-copy">
                <h3 className="c-results__empty-title">
                  Ingen pakt hittades
                </h3>
                <p className="c-results__empty-description">
                  Prova att flytta eller zooma kartan, eller sök efter en annan
                  kommun. Du kan också skapa en lokal pakt.
                </p>
              </div>
            </div>
            <div className="c-results__empty-action">
              <a
                href="https://ki-ds.org/foraldrapakten/ga-med"
                className="c-results__create-link"
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
