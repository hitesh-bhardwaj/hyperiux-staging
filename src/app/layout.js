import localFont from "next/font/local";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

const aeonik = localFont({
  src: [
    { path: "../../public/assets/fonts/Aeonik-Thin.woff2", weight: "100" },
    { path: "../../public/assets/fonts/Aeonik-Light.woff2", weight: "300" },
    { path: "../../public/assets/fonts/Aeonik-Regular.woff2", weight: "400" },
    { path: "../../public/assets/fonts/Aeonik-Medium.woff2", weight: "500" },
    { path: "../../public/assets/fonts/Aeonik-Bold.woff2", weight: "700" },
  ],
  variable: "--font-aeonik",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const ageo = localFont({
  src: [
    { path: "../../public/assets/fonts/Ageo.woff2", weight: "400" },
    { path: "../../public/assets/fonts/Ageo-Medium.woff2", weight: "500" },
    { path: "../../public/assets/fonts/Ageo-SemiBold.woff2", weight: "600" },
    { path: "../../public/assets/fonts/Ageo-Bold.woff2", weight: "700" },
  ],
  variable: "--font-ageo",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata = {
  title: "Hyperiux",
  description: "Digital Experience Design Agency",
  icons: {
    icon: [{ url: "/hyperiux.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: "/hyperiux.svg",
  },
};

export default function RootLayout({ children }) {
  return (
  <html
      lang="en"
      className={`${ageo.variable} ${aeonik.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}