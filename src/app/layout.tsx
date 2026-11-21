import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { setLocale } from "@/i18n/generated";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

// The language comes from the request (the `locale` cookie, else
// Accept-Language), and the download from its system, so every page renders
// per request.
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await setLocale();
  return (
    // Hostline's page marks <html> with data-link before React loads (src/app/hostline/page.tsx)
    <html
      lang={locale}
      className={`dark h-full font-sans antialiased ${inter.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="relative flex min-h-full flex-col">{children}</body>
    </html>
  );
}
