// Catalogue unique des prestations : utilisé par /tarifs, /prestations,
// /reservation et l'API. Les prix sont en Francs Congolais (FC).

export type ServiceCategory = {
  slug: string;
  title: string;
  emoji: string;
};

export type Service = {
  slug: string;
  category: string; // slug de catégorie, ou "forfaits"
  name: string;
  price: number; // FC
  duration: string;
  durationMin: number;
};

export const CATEGORIES: ServiceCategory[] = [
  { slug: "makeup", title: "Makeup", emoji: "💄" },
  { slug: "manucure", title: "Manucure & Nail Art", emoji: "💅" },
  { slug: "pedicure", title: "Pédicure", emoji: "🦶" },
  { slug: "visage", title: "Soins du visage", emoji: "✨" },
  { slug: "bien-etre", title: "Épilation & Bien-être", emoji: "🌸" },
  { slug: "forfaits", title: "Forfaits", emoji: "🎁" },
];

export const SERVICES: Service[] = [
  { slug: "maquillage-naturel", category: "makeup", name: "Maquillage naturel", price: 15000, duration: "45 min", durationMin: 45 },
  { slug: "maquillage-soiree", category: "makeup", name: "Maquillage soirée", price: 25000, duration: "1h", durationMin: 60 },
  { slug: "maquillage-mariage", category: "makeup", name: "Maquillage mariage", price: 50000, duration: "2h", durationMin: 120 },
  { slug: "essai-maquillage", category: "makeup", name: "Essai maquillage", price: 30000, duration: "1h30", durationMin: 90 },

  { slug: "manucure-classique", category: "manucure", name: "Manucure classique", price: 8000, duration: "30 min", durationMin: 30 },
  { slug: "vernis-gel", category: "manucure", name: "Pose de vernis gel", price: 15000, duration: "1h", durationMin: 60 },
  { slug: "nail-art", category: "manucure", name: "Nail art (par ongle)", price: 2000, duration: "15 min", durationMin: 15 },
  { slug: "depose-repose-gel", category: "manucure", name: "Dépose + repose gel", price: 20000, duration: "1h30", durationMin: 90 },

  { slug: "pedicure-classique", category: "pedicure", name: "Pédicure classique", price: 10000, duration: "45 min", durationMin: 45 },
  { slug: "pedicure-spa", category: "pedicure", name: "Pédicure spa", price: 18000, duration: "1h15", durationMin: 75 },
  { slug: "vernis-pieds", category: "pedicure", name: "Pose vernis pieds", price: 5000, duration: "20 min", durationMin: 20 },
  { slug: "gommage-pieds", category: "pedicure", name: "Gommage pieds", price: 8000, duration: "30 min", durationMin: 30 },

  { slug: "nettoyage-peau", category: "visage", name: "Nettoyage de peau", price: 12000, duration: "45 min", durationMin: 45 },
  { slug: "soin-hydratant", category: "visage", name: "Soin hydratant", price: 18000, duration: "1h", durationMin: 60 },
  { slug: "masque-purifiant", category: "visage", name: "Masque purifiant", price: 10000, duration: "30 min", durationMin: 30 },
  { slug: "soin-anti-taches", category: "visage", name: "Soin anti-taches", price: 22000, duration: "1h", durationMin: 60 },

  { slug: "epilation-sourcils", category: "bien-etre", name: "Épilation sourcils", price: 3000, duration: "15 min", durationMin: 15 },
  { slug: "epilation-moustache", category: "bien-etre", name: "Épilation moustache", price: 2000, duration: "10 min", durationMin: 10 },
  { slug: "epilation-jambes", category: "bien-etre", name: "Épilation jambes", price: 15000, duration: "45 min", durationMin: 45 },
  { slug: "gommage-corporel", category: "bien-etre", name: "Gommage corporel", price: 25000, duration: "1h", durationMin: 60 },

  { slug: "detente", category: "forfaits", name: "Forfait Détente", price: 35000, duration: "2h", durationMin: 120 },
  { slug: "glamour", category: "forfaits", name: "Forfait Glamour", price: 65000, duration: "3h30", durationMin: 210 },
  { slug: "mariee", category: "forfaits", name: "Forfait Mariée", price: 120000, duration: "5h", durationMin: 300 },
];

export function getService(slug: string | null | undefined): Service | undefined {
  if (!slug) return undefined;
  return SERVICES.find((s) => s.slug === slug);
}

export function isCategory(slug: string | null | undefined): boolean {
  return !!slug && CATEGORIES.some((c) => c.slug === slug);
}

export function formatFC(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} FC`;
}

/** Lien de réservation qui présélectionne un service (ou une catégorie). */
export function reservationHref(opts?: { service?: string; category?: string }): string {
  if (opts?.service && getService(opts.service)) return `/reservation?service=${opts.service}`;
  if (opts?.category && isCategory(opts.category)) return `/reservation?categorie=${opts.category}`;
  return "/reservation";
}

// Créneaux : lun-sam 8h-20h, dimanche 9h-16h (dernier départ 1h avant la fermeture)
export function slotsForDate(date: string): string[] {
  const d = new Date(`${date}T12:00:00`);
  const isSunday = d.getDay() === 0;
  const [start, end] = isSunday ? [9, 15] : [8, 19];
  const out: string[] = [];
  for (let h = start; h <= end; h++) out.push(`${String(h).padStart(2, "0")}:00`);
  return out;
}
