import Router from "./router/Router"
import { ThemeProvider } from "./components/theme-provider"
import { useEffect, useState } from "react";
import PreLoader from "./components/PreLoader";
import { SeasonProvider } from "./components/season-provider";

function App() {

  const [isLoading, setIsLoading] = useState(true); // Loading state
  useEffect(() => {
    // keep the loader up long enough for its bar to finish, never longer than 3s
    let minDelay;
    const finish = () => {
      minDelay = setTimeout(() => setIsLoading(false), 900);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(minDelay);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <ThemeProvider defaultTheme="auto" storageKey="vite-ui-theme">
        <SeasonProvider>
          {isLoading ? <PreLoader /> : <Router />}
        </SeasonProvider>
      </ThemeProvider>
    </>
  )
}

export default App
