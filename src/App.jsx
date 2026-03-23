import Router from "./router/Router"
import { ThemeProvider } from "./components/theme-provider"
import { useEffect, useState } from "react";
import PreLoader from "./components/PreLoader";

function App() {

  const [isLoading, setIsLoading] = useState(true); // Loading state
  useEffect(() => {
    window.addEventListener("load", () => {
      setIsLoading(false);
    });
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {isLoading ? <PreLoader /> : <Router />}
      </ThemeProvider>
    </>
  )
}

export default App