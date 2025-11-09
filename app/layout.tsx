import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F💪exAI",
  description:
    "FlexAI is a platform for creating and managing workout routines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
