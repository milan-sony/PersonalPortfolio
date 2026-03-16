import Router from "./router/Router"
import { ThemeProvider } from "./components/theme-provider"

function App() {
  return (
    <>

      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router />
      </ThemeProvider>
    </>
  )
}

export default App