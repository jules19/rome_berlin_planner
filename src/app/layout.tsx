import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trip Board",
  description: "Shared travel ideas for Berlin + Rome",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
