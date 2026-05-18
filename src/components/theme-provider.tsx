"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// If you get a type error on ThemeProviderProps, you can ignore it or import it from next-themes/dist/types

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}