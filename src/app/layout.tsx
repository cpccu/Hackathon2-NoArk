import type { Metadata } from "next";
import { Poppins, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";

const inter = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const merriweather = Poppins({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Campus-OS – City University",
  description: "Unified web portal and campus life operating system for City University (Khagan, Birulia, Savar).",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} ${notoSansBengali.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-campus-gold-200 selection:text-campus-navy-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-campus-navy-800 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-campus-gold-400"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <LanguageProvider>
                <div id="main-content" className="min-h-screen flex flex-col">
                  {children}
                </div>
              </LanguageProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
