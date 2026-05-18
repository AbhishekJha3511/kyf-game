import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "KnowMe | How well do they know you?",
  description: "Build a personal flashcard quiz in 60 seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Note the shift to dynamic base colors: bg-white dark:bg-[#09090b] */}
      <body className="bg-white text-zinc-950 dark:bg-[#09090b] dark:text-zinc-50 min-h-screen antialiased selection:bg-violet-500/30 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}