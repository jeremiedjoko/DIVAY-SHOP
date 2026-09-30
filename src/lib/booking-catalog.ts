export type ServiceCategoryId = "makeup" | "manucure" | "pedicure" | "visage" | "bienetre";

export type BookableService = {
  id: string;
  category: ServiceCategoryId;
  label: string;
  duration: string;
  price: string;
};

export type BeautyPackage = {
  id: string;
  name: string;
  price: string;
  desc: string;
  highlight: boolean;
  features: string[];
};

export const SERVICE_CATEGORIES: {
  id: ServiceCategoryId;
  title: string;
  emoji: string;
  desc: string;
  img: string;
}[] = [
  {
    id: "makeup",
    title: "Makeup & Coiffure",
    emoji: "💄",
    desc: "Un maquillage professionnel pour sublimer votre beauté naturelle en toute occasion.",
    img: "/bank/pexels-eyeboll-studios-3088642-4684193.jpg",
  },
  {
    id: "manucure",
    title: "Manucure & Nail Art",
    emoji: "💅",
    desc: "Des mains parfaites avec nos soins des ongles, poses de gel et nail art créatif.",
    img: "/bank/pexels-rdne-7755287.jpg",
  },
  {
    id: "pedicure",
    title: "Pédicure & Soins des pieds",
    emoji: "🦶",
    desc: "Prenez soin de vos pieds avec nos soins de pédicure complets et relaxants.",
    img: "/bank/OIP.webp",
  },
  {
    id: "visage",
    title: "Soins du visage",
    emoji: "✨",
    desc: "Des soins personnalisés pour une peau éclatante, hydratée et purifiée.",
    img: "/bank/596f4bbc50080-soins-visage-african-lady-togo.jpg",
  },
  {
    id: "bienetre",
    title: "Épilation & Bien-être",
    emoji: "🌸",
    desc: "Épilation douce, gommage corporel et soins de bien-être pour vous ressourcer.",
    img: "/bank/pexels-sora-shimazaki-5938278.jpg",
  },
];

export const BOOKABLE_SERVICES: BookableService[] = [
  { id: "makeup-naturel", category: "makeup", label: "Maquillage naturel", duration: "45 min", price: "15 000 FC" },
  { id: "makeup-soir", category: "makeup", label: "Maquillage soirée", duration: "1h", price: "25 000 FC" },
  { id: "makeup-mariage", category: "makeup", label: "Maquillage mariage", duration: "2h", price: "50 000 FC" },
  { id: "makeup-essai", category: "makeup", label: "Essai maquillage", duration: "1h30", price: "30 000 FC" },
  { id: "manucure", category: "manucure", label: "Manucure classique", duration: "30 min", price: "8 000 FC" },
  { id: "gel", category: "manucure", label: "Pose de vernis gel", duration: "1h", price: "15 000 FC" },
  { id: "nail-art", category: "manucure", label: "Nail art (par ongle)", duration: "15 min", price: "2 000 FC" },
  { id: "gel-repose", category: "manucure", label: "Dépose + repose gel", duration: "1h30", price: "20 000 FC" },
  { id: "pedicure", category: "pedicure", label: "Pédicure classique", duration: "45 min", price: "10 000 FC" },
  { id: "pedicure-spa", category: "pedicure", label: "Pédicure spa", duration: "1h15", price: "18 000 FC" },
  { id: "vernis-pieds", category: "pedicure", label: "Pose vernis pieds", duration: "20 min", price: "5 000 FC" },
  { id: "gommage-pieds", category: "pedicure", label: "Gommage pieds", duration: "30 min", price: "8 000 FC" },
  { id: "nettoyage", category: "visage", label: "Nettoyage de peau", duration: "45 min", price: "12 000 FC" },
  { id: "visage", category: "visage", label: "Soin hydratant visage", duration: "1h", price: "18 000 FC" },
  { id: "masque", category: "visage", label: "Masque purifiant", duration: "30 min", price: "10 000 FC" },
  { id: "anti-taches", category: "visage", label: "Soin anti-taches", duration: "1h", price: "22 000 FC" },
  { id: "epilation-sourcils", category: "bienetre", label: "Épilation sourcils", duration: "15 min", price: "3 000 FC" },
  { id: "epilation-moustache", category: "bienetre", label: "Épilation moustache", duration: "10 min", price: "2 000 FC" },
  { id: "epilation-jambes", category: "bienetre", label: "Épilation jambes", duration: "45 min", price: "15 000 FC" },
  { id: "gommage", category: "bienetre", label: "Gommage corporel", duration: "1h", price: "25 000 FC" },
];

export const BEAUTY_PACKAGES: BeautyPackage[] = [
  {
    id: "detente",
    name: "Forfait Détente",
    price: "35 000 FC",
    desc: "Un moment de pur bien-être",
    highlight: false,
    features: ["Manucure classique", "Pédicure classique", "Masque visage", "Vernis offert"],
  },
  {
    id: "glamour",
    name: "Forfait Glamour",
    price: "65 000 FC",
    desc: "Pour briller en toute occasion",
    highlight: true,
    features: ["Maquillage soirée", "Pose gel mains", "Pédicure spa", "Soin hydratant visage"],
  },
  {
    id: "mariee",
    name: "Forfait Mariée",
    price: "120 000 FC",
    desc: "Le grand jour mérite le meilleur",
    highlight: false,
    features: ["Maquillage mariage", "Essai maquillage inclus", "Pose gel mains", "Pédicure spa", "Soin visage complet"],
  },
];

export function findService(id: string | null | undefined) {
  if (!id) return undefined;
  return BOOKABLE_SERVICES.find((s) => s.id === id);
}

export function findPackage(id: string | null | undefined) {
  if (!id) return undefined;
  return BEAUTY_PACKAGES.find((p) => p.id === id);
}

export function servicesByCategory(category: string | null | undefined) {
  if (!category) return BOOKABLE_SERVICES;
  return BOOKABLE_SERVICES.filter((s) => s.category === category);
}

export function isServiceCategory(value: string | null | undefined): value is ServiceCategoryId {
  return SERVICE_CATEGORIES.some((c) => c.id === value);
}

export function reservationHref(opts?: {
  service?: string | null;
  forfait?: string | null;
  categorie?: string | null;
}) {
  const params = new URLSearchParams();
  if (opts?.forfait) params.set("forfait", opts.forfait);
  else if (opts?.service) params.set("service", opts.service);
  else if (opts?.categorie) params.set("categorie", opts.categorie);
  const q = params.toString();
  return q ? `/reservation?${q}` : "/reservation";
}
