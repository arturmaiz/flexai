import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { NavigationMenuComponent } from "./NavigationMenu/NavigationMenu";
import { Footer } from "./Footer/Footer";

export const metadata: Metadata = {
  title: "FlexAI — AI Pilates & Yoga",
  description:
    "FlexAI generates personalized Pilates and Yoga plans powered by AI — with video tutorials and adaptive progression.",
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
