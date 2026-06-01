import { ThemeProvider } from "@/contexts/ThemeContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

function App() {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
