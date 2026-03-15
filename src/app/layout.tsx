import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Naasthamukk",
  description: "Split expenses with friends and groups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ background: "#FF6B74" }}>
      <body className="antialiased min-h-screen" style={{ background: "#FF6B74", color: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
