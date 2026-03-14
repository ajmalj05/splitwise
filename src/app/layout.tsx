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
    <html lang="en" className="bg-zinc-50 text-zinc-900">
      <body className="antialiased min-h-screen bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
