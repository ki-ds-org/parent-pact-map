import "./App.css";
import Map from "./components/Map";
import Button from "./components/Button";
import usePacts from "./hooks/usePacts";
import classNames from "classnames";
import { logInfo } from "./util/log";

function App() {
  const { pacts, loading, error, retry } = usePacts();
  const isUrlGithub = window.location.hostname.includes("github.io");
  const isUrlLocalhost = window.location.hostname.includes("localhost");

  logInfo("hostname", window.location.hostname);

  const containerClass = classNames(
    "react-pact-map w-full max-h-screen bg-background text-on-background overflow-scroll",
    {
      "h-screen": isUrlGithub || isUrlLocalhost,
      "h-full": !isUrlGithub && !isUrlLocalhost,
    }
  );

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
