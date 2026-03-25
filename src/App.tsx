import "./App.css";
import Map from "./components/Map";
import Button from "./components/Button";
import usePacts from "./hooks/usePacts";

function App() {
  const { pacts, loading, error, retry } = usePacts();
  const containerClass = "react-pact-map w-full h-full bg-background text-on-background overflow-scroll";

  if (loading) {
    return (
      <div className={containerClass + " flex items-center justify-center"}>
        <p className="text-on-background">Laddar pakter...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClass + " flex flex-col items-center justify-center gap-4 p-4"}>
        <p className="text-on-background text-center">
          Kunde inte ladda pakter: {error}
        </p>
        <Button variant="primary" onClick={retry}>
          Försök igen
        </Button>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <Map pacts={pacts} />
    </div>
  );
}

export default App;
