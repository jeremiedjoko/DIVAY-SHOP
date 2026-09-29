import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Galerie — Divay Beauty",
  description: "Découvrez nos plus belles réalisations en makeup, manucure, soins et bien-être.",
};

const categories = ["Tous", "Makeup", "Manucure", "Pédicure", "Soins visage", "Bien-être"];

const photos = [
  { src: "/bank/pexels-eyeboll-studios-3088642-4684193.jpg", cat: "Makeup", label: "Maquillage soirée" },
  { src: "/bank/pexels-rdne-7755287.jpg", cat: "Manucure", label: "Nail art floral" },
  { src: "/bank/596f4bbc50080-soins-visage-african-lady-togo.jpg", cat: "Soins visage", label: "Soin hydratant" },
  { src: "/bank/OIP.webp", cat: "Pédicure", label: "Pédicure spa" },
  { src: "/bank/pexels-sora-shimazaki-5938278.jpg", cat: "Bien-être", label: "Modelage" },
  { src: "/bank/pexels-babajide-olusanya-2151643024-36331023.jpg", cat: "Makeup", label: "Maquillage naturel" },
  { src: "/bank/pexels-darksight-image-736222078-36537457.jpg", cat: "Soins visage", label: "Masque purifiant" },
  { src: "/bank/pexels-thekehindeogunsanya-11515392.jpg", cat: "Manucure", label: "Gel couleur" },
  { src: "/bank/pexels-darkshadephotos-39287202.jpg", cat: "Makeup", label: "Maquillage mariage" },
  { src: "/bank/OIP (3).webp", cat: "Bien-être", label: "Gommage" },
  { src: "/bank/pexels-el-gringo-photo-116752370-16052873.jpg", cat: "Soins visage", label: "Nettoyage peau" },
  { src: "/bank/pexels-babajide-olusanya-2151643024-36331023.jpg", cat: "Manucure", label: "Manucure française" },
];

export default function GaleriePage() {
  return (
    <main className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="bg-[#fff0f4] py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c0476b]">NOTRE GALERIE</p>
          <h1 className="mt-3 font-serif text-5xl text-[#2a1c15]">Nos réalisations</h1>
          <p
            className="mt-1 text-[#9e3457]"
            style={{ fontFamily: "var(--font-cursive), cursive", fontSize: "40px" }}
          >
            La beauté en images
          </p>
          <p className="mt-5 text-sm text-stone-600">
            Chaque photo reflète notre passion pour la beauté et l&apos;excellence de nos prestations.
          </p>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {photos.map((photo, i) => (
            <div key={i} className="group relative mb-4 overflow-hidden rounded-2xl break-inside-avoid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.label}
                className="w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                <span className="rounded-full bg-[#c0476b] px-3 py-1 text-[10px] font-bold text-white">{photo.cat}</span>
                <p className="mt-1 text-center text-xs font-semibold text-white">{photo.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-[#c0476b] py-16 text-center text-white">
        <h2 className="font-serif text-3xl">Vous aussi, sublimez-vous !</h2>
        <p className="mt-3 text-sm opacity-80">Prenez rendez-vous et rejoignez nos clientes satisfaites.</p>
        <Link
          href="/reservation"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#c0476b] transition hover:bg-[#fff0f4]"
        >
          <Calendar className="h-4 w-4" /> Réserver <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
