import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRACEBACK — Knowledge Diagnostic Lab",
  description: "Find the missing link in your engineering reasoning.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
