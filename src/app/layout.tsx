import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SHOP_NAME } from "@/lib/currency";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: `${SHOP_NAME} — Boutique beauté à Kinshasa`,
    template: `%s · ${SHOP_NAME}`,
  },
  description:
    "DIVAY BEAUTY : maquillage et soins sélectionnés avec soin. Prix en USD ou franc congolais. Paiement sécurisé ou à la livraison à Kinshasa.",
  openGraph: {
    title: `${SHOP_NAME} — Boutique beauté`,
    description: "Maquillage et soins. Livraison rapide à Kinshasa.",
    url: "https://divaybeauty.com",
    siteName: SHOP_NAME,
    locale: "fr_CD",
    type: "website",
  },
};

// Le layout racine ne contient PAS SiteHeader/SiteFooter.
// Chaque sous-layout (admin, shop) gère sa propre navigation.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#faf8f5] text-stone-900">
        {children}
      </body>
    </html>
  );
}
