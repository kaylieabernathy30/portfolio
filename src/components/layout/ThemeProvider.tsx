"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // The NextThemesProvider itself will handle applying the defaultTheme
  // and managing the class on the html element when attribute="class".
  // The custom useEffect previously here was likely redundant or conflicting.
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
