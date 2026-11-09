import "./App.css";
import Map from "./components/Map";
import Button from "./components/Button";
import usePacts from "./hooks/usePacts";

function App() {
  const { pacts, loading, error, retry } = usePacts();
  const containerClass = "react-pact-map w-full bg-background text-on-background";

  if (loading) {
    return (
      <main className={containerClass + " min-h-48 flex items-center justify-center"}>
        <p className="sr-only" role="status" aria-live="polite">
          Laddar pakter...
        </p>
        <p className="text-on-background">Laddar pakter...</p>
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
