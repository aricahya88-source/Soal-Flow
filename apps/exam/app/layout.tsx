import type { Metadata } from "next";
import { ThemeProvider } from "@seleksi/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoalFlow Exam",
  description: "Aplikasi ujian peserta SoalFlow",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
