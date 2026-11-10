import Map from "../Map/Map";
import Button from "../Controls/Button";
import usePacts from "../../hooks/usePacts";

function App() {
  const { pacts, loading, error, retry } = usePacts();
  const containerClass = "react-pact-map c-app";

  if (loading) {
    return (
      <main
        className={
          containerClass +
          " c-app__state c-app__state--loading"
        }
      >
        <p className="u-visually-hidden" role="status" aria-live="polite">
          Laddar pakter...
        </p>
        <div
          aria-hidden="true"
          className="c-app__spinner"
        />
        <p className="c-app__loading-message" aria-hidden="true">
          Laddar pakter...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={containerClass + " c-app__state c-app__state--error"}>
        <p className="c-app__error-message" role="alert">
          Kunde inte ladda pakter: {error}
        </p>
        <Button variant="primary" onClick={retry}>
          Försök igen
        </Button>
      </main>
    );
  }

  return (
    <main className={containerClass} aria-label="Föräldrapakten">
      <Map pacts={pacts} />
    </main>
  );
}

export default App;
