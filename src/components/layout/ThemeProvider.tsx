"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    // Ensure the html tag has the dark class if defaultTheme is dark
    // This helps if localStorage isn't immediately available or if system preference is ignored
    if (props.defaultTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, [props.defaultTheme]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
