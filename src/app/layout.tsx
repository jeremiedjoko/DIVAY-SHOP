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

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "L'Écrin";

export const metadata: Metadata = {
  title: {
    default: `${shopName} — Boutique en ligne`,
    template: `%s · ${shopName}`,
  },
  description:
    "Boutique en ligne élégante : accessoires, maison et bijoux. Paiement sécurisé ou à la livraison.",
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
