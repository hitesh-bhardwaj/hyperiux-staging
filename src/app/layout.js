import localFont from "next/font/local";
import "./globals.css";

const aeonikPro = localFont({
  src: [
    { path: "../../public/assets/fonts/AeonikPro-Light.woff2", weight: "300" },
    { path: "../../public/assets/fonts/AeonikPro-Regular.woff2", weight: "400" },
    { path: "../../public/assets/fonts/AeonikPro-Medium.woff2", weight: "500" },
    { path: "../../public/assets/fonts/AeonikPro-Bold.woff2", weight: "700" },
  ],
  variable: "--font-aeonikpro",
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
    <html lang="en" className={`${aeonikPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
