import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ME — Mica Ella | Pre-Loved Fashion Archives",
  description: "Curated 1-of-1 pre-loved luxury fashion, vintage archival pieces, and authenticated designer collectibles in the Philippines.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0d0d0d] text-[#faf9f6] selection:bg-[#f472b6] selection:text-black">
        {children}
      </body>
    </html>
  );
}
