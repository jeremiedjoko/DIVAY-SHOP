import type { Metadata } from "next";
import { Geist, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-cursive",
  subsets: ["latin"],
});

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "DIVAY BEAUTY";

export const metadata: Metadata = {
  title: {
    default: `${shopName} — Salon de beauté & boutique artisanale`,
    template: `%s · ${shopName}`,
  },
  description:
    "Soins de beauté (makeup, manucure, pédicure, soins du visage) et créations artisanales. Réservez en ligne, payez à la livraison.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${playfair.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#faf8f5] text-stone-900">
        {children}
      </body>
    </html>
  );
}
