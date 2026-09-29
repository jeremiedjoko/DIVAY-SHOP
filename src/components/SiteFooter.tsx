import Link from "next/link";
import { Phone, MapPin, Mail, MessageCircle } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#1a120e] text-[#f2ebe5]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          
          {/* Logo & Brand */}
          <div className="col-span-1 flex flex-col items-start md:items-center text-center">
            <div className="flex items-center gap-1 font-serif text-3xl text-white tracking-tight">
              <span className="text-4xl">D</span>
              <span className="text-4xl">B</span>
            </div>
            <div className="font-serif text-xl tracking-widest mb-1 uppercase mt-2">Divay Beauty</div>
            <div 
              className="text-[#c9b4a7] mt-1" 
              style={{ fontFamily: 'var(--font-cursive), cursive', fontSize: '14px' }}
            >
              Sublimez votre beauté
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-white">Nous contacter</h3>
            <ul className="space-y-4 text-[11px] font-light text-[#d8cbc4]">
              <li className="flex items-center gap-3">
                <Phone className="h-3.5 w-3.5" /> +243 87 123 45 67
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-3.5 w-3.5" /> @divay_beauty
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-3.5 w-3.5" /> Kinshasa, RDC
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div className="col-span-1">
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-white">Horaires d'ouverture</h3>
            <ul className="space-y-4 text-[11px] font-light text-[#d8cbc4]">
              <li className="flex gap-3">
                <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                <div>
                  <p>Lundi - Samedi : 8h - 20h</p>
                  <p className="mt-2">Dimanche : 9h - 16h</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Liens utiles */}
          <div className="col-span-1">
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-white">Liens utiles</h3>
            <ul className="space-y-3 text-[11px] font-light text-[#d8cbc4]">
              <li><Link href="/prestations" className="hover:text-white transition">Nos services</Link></li>
              <li><Link href="/tarifs" className="hover:text-white transition">Tarifs</Link></li>
              <li><Link href="/a-propos" className="hover:text-white transition">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Suivez-nous */}
          <div className="col-span-1">
            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-white">Suivez-nous</h3>
            <div className="flex gap-4 text-[#d8cbc4]">
              <a href="#" className="hover:text-white transition">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition"><MessageCircle className="h-4 w-4" /></a>
            </div>
            <p 
              className="mt-6 text-[#c9b4a7]"
              style={{ fontFamily: 'var(--font-cursive), cursive', fontSize: '18px' }}
            >
              Belle aujourd'hui, plus belle demain ♡
            </p>
          </div>

        </div>
      </div>
      <div className="border-t border-[#2a1c15] bg-[#110908] py-5 text-center text-[9px] uppercase tracking-[0.3em] text-[#8c7a6e] font-medium">
        &copy; 2026 DIVAY BEAUTY &mdash; TOUS DROITS RÉSERVÉS
      </div>
    </footer>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}
