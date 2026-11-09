import "./App.css";
import Map from "./components/Map";
import usePacts from "./hooks/usePacts";

function App() {
  const { pacts, loading, error, retry } = usePacts();
  const containerClass = "react-pact-map w-full h-full bg-background text-on-background overflow-scroll";

  return (
    <div className={containerClass}>
      <Map pacts={pacts} loading={loading} error={error} retry={retry} />
    </div>
  );
}

export default App;
