import { sitePath } from "@/lib/site-path";
import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";
import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/fill";
import "@phosphor-icons/web/bold";

export const metadata: Metadata = {
  title: { default: "CMIEA — Educație pentru fiecare", template: "%s — CMIEA" },
  description:
    "Centrul Municipal de Învățare și Educație a Adulților. Cursuri gratuite, evenimente și cluburi în Chișinău.",
};
const themeScript = `try{if(localStorage.getItem('color-theme')==='dark'||(!localStorage.getItem('color-theme')&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch{}`;
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <base href={sitePath("/")} />
        <link rel="icon" href={sitePath("/assets/icon.ico")} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="site-page">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
