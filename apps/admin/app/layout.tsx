import type { Metadata } from "next";
import Script from "next/script";
import { ImageCacheBuster, ThemeProvider } from "@seleksi/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SoalFlow", template: "%s | SoalFlow" },
  description: "Pengelolaan kisi-kisi, plotting penulis dan validator, penulisan soal, serta paket ujian",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ImageCacheBuster />
        <Script
          id="mathjax-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.MathJax = { tex: { inlineMath: [['\\\\(', '\\\\)']], displayMath: [['\\\\[', '\\\\]']] }, svg: { fontCache: 'global' } };`
          }}
        />
        <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" strategy="afterInteractive" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
