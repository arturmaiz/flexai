import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { NavigationMenuComponent } from "./NavigationMenu/NavigationMenu";
import { Footer } from "./Footer/Footer";

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
      <body suppressHydrationWarning>
        <NavigationMenuComponent />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
