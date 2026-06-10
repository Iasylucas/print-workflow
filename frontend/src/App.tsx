import { ThemeProvider } from "@/contexts/ThemeContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useCompanyStore } from "./features/company-info/stores/companyStore";
import { useEffect } from "react";

function App() {
  const fetchCompany = useCompanyStore((state) => state.fetchCompany);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
