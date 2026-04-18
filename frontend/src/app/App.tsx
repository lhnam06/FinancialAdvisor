import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./lib/theme";
import { LocaleProvider } from "./lib/locale";

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <RouterProvider router={router} />
      </LocaleProvider>
      <Toaster />
    </ThemeProvider>
  );
}
