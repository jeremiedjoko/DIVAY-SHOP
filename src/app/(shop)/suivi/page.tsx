import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import SuiviClient from "./SuiviClient";

type Props = { searchParams: Promise<{ order?: string }> };

export default async function SuiviPage({ searchParams }: Props) {
  const session = await getSession();
  
  // Si l'utilisateur est connecté, on le redirige directement vers son tableau de bord
  if (session?.userId) {
    redirect("/compte");
  }

  const { order } = await searchParams;
  
  // Si l'utilisateur n'est pas connecté, on affiche le formulaire 
  // en pré-remplissant le numéro de commande s'il vient de payer
  return <SuiviClient initialOrder={order || ""} />;
}
