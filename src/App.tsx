import "./App.css";
import Map from "./components/Map";
import Button from "./components/Button";
import usePacts from "./hooks/usePacts";

function App() {
  const { pacts, loading, error, retry } = usePacts();
  const containerClass = "react-pact-map w-full bg-background text-on-background";

  if (loading) {
    return (
      <main
        className={
          containerClass +
          " flex flex-col items-center justify-center gap-6 min-h-48"
        }
      >
        <p className="sr-only" role="status" aria-live="polite">
          Laddar pakter...
        </p>
        <div
          aria-hidden="true"
          className="animate-spin rounded-full border-8 border-current border-t-transparent text-on-background opacity-80 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
        />
        <p className="text-on-background text-xl sm:text-2xl" aria-hidden="true">
          Laddar pakter...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={containerClass + " min-h-48 flex flex-col items-center justify-center gap-4 p-4"}>
        <p className="text-on-background text-center" role="alert">
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
