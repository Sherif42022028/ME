import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ME — Micaela Ella Admin Dashboard",
  description: "Production-ready admin dashboard for ME Micaela Ella pre-loved fashion e-commerce.",
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
