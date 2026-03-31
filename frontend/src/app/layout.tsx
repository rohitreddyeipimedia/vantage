import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vantage — Competitive Intelligence for B2C Brands",
  description: "See what your competitors see. Act before they do.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
