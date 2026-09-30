import type { Metadata } from "next";
import ReservationClient from "./ReservationClient";
import { getService, isCategory } from "@/lib/services-catalog";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description: "Réservez votre soin de beauté en ligne : choisissez la prestation, la date et l'heure.",
};

type Props = { searchParams: Promise<{ service?: string; forfait?: string; categorie?: string }> };

export default async function ReservationPage({ searchParams }: Props) {
  const sp = await searchParams;
  // « forfait » est conservé pour les anciens liens de la page Tarifs
  const serviceParam = sp.service ?? sp.forfait;
  const service = getService(serviceParam)?.slug;
  const category = isCategory(sp.categorie) ? sp.categorie : undefined;
  return <ReservationClient initialService={service} initialCategory={category} />;
}
