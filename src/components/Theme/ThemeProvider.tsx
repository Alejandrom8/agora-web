"use client";
import React from "react";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import { THEMES, ThemeMode } from "./index";

type Ctx = { mode: ThemeMode; toggle: () => void; setMode: (m: ThemeMode) => void };
const ThemeCtx = React.createContext<Ctx>({ mode: "light", toggle: () => {}, setMode: () => {} });
export const useAppTheme = () => React.useContext(ThemeCtx);

export const AppThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Evita mismatch SSR leyendo en efecto
  const [mode, setMode] = React.useState<ThemeMode>("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const saved = (localStorage.getItem("theme") as ThemeMode) || null;
    if (saved) setMode(saved);
    else {
      // fallback a preferencia del SO
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(prefersDark ? "dark" : "light");
    }
    setMounted(true);
  }, []);

  const toggle = React.useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  if (!mounted) {
    // Evita FOUC: renderiza background básico hasta hidratar
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeCtx.Provider value={{ mode, toggle, setMode }}>
      <MUIThemeProvider theme={THEMES[mode]}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeCtx.Provider>
  );
};