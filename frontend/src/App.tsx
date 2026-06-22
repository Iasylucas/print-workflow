import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useCompanyStore } from "./features/company-info/stores/companyStore";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useTheme } from "./contexts/ThemeContext";

function App() {
  const { theme } = useTheme();
  const fetchCompany = useCompanyStore((state) => state.fetchCompany);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        theme={theme as "light" | "dark" | "system"}
      />
    </>
  );
}

export default App;
