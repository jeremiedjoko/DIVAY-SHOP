import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const dbPath = fs.existsSync(path.join(process.cwd(), "sqlite.db"))
  ? path.join(process.cwd(), "sqlite.db")
  : "./sqlite.db";

const sql = new Database(dbPath);

function columnExists(table: string, column: string): boolean {
  const cols = sql.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  return cols.some((c) => c.name === column);
}

console.log("📦 Migration média Divay Beauty…");

sql.exec(`
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  bucket TEXT NOT NULL,
  asset_folder TEXT,
  storage_path TEXT NOT NULL,
  public_base_path TEXT NOT NULL,
  alt_text TEXT,
  focal_x INTEGER NOT NULL DEFAULT 50,
  focal_y INTEGER NOT NULL DEFAULT 50,
  width INTEGER,
  height INTEGER,
  mime_type TEXT,
  source TEXT,
  source_url TEXT,
  license_note TEXT,
  is_stock INTEGER NOT NULL DEFAULT 0,
  variants_json TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS site_sections (
  id TEXT PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  media_id TEXT REFERENCES media(id) ON DELETE SET NULL,
  meta_json TEXT
);

CREATE TABLE IF NOT EXISTS beauty_services (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  media_id TEXT REFERENCES media(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY,
  media_id TEXT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);
`);

for (const col of [
  ["media_id", "TEXT"],
  ["alt_text", "TEXT"],
  ["is_main", "INTEGER NOT NULL DEFAULT 0"],
] as const) {
  if (!columnExists("product_images", col[0])) {
    sql.exec(`ALTER TABLE product_images ADD COLUMN ${col[0]} ${col[1]}`);
  }
}

// url peut être null si media_id est défini
try {
  sql.exec(`CREATE TABLE IF NOT EXISTS product_images_new (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    media_id TEXT,
    url TEXT,
    alt_text TEXT,
    is_main INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0
  )`);
} catch {
  /* ignore */
}

const sectionSeeds: { key: string; label: string }[] = [
  { key: "hero_main", label: "Accueil — Hero principal" },
  { key: "booking_banner", label: "Accueil — Bannière rendez-vous" },
  { key: "shop_category_sacs", label: "Accueil — Catégorie Sacs" },
  { key: "shop_category_pagne", label: "Accueil — Catégorie Sacs pagne" },
  { key: "shop_category_perles", label: "Accueil — Catégorie Perles" },
  { key: "shop_category_creations", label: "Accueil — Créations perles" },
  { key: "shop_category_eventails", label: "Accueil — Éventails" },
  { key: "shop_category_cadeaux", label: "Accueil — Cadeaux" },
];

const insertSection = sql.prepare(
  `INSERT OR IGNORE INTO site_sections (id, section_key, label) VALUES (?, ?, ?)`,
);
for (const s of sectionSeeds) {
  insertSection.run(randomUUID(), s.key, s.label);
}

const serviceSeeds = [
  { slug: "makeup", title: "Makeup", description: "Maquillage naturel, soirée, cérémonie, mariage...", icon: "💄", order: 1 },
  { slug: "manucure", title: "Manucure", description: "Beauté des mains, pose de vernis, gel, nail art...", icon: "💅", order: 2 },
  { slug: "pedicure", title: "Pédicure", description: "Soin des pieds, pédicure esthétique, finition...", icon: "👣", order: 3 },
  { slug: "visage", title: "Soins du visage", description: "Nettoyage, hydratation, soins personnalisés...", icon: "💆‍♀️", order: 4 },
  { slug: "bienetre", title: "Soins & bien-être", description: "Épilation, gommage, modelage et bien plus...", icon: "🪷", order: 5 },
];

const insertService = sql.prepare(
  `INSERT OR IGNORE INTO beauty_services (id, slug, title, description, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
);
for (const s of serviceSeeds) {
  insertService.run(randomUUID(), s.slug, s.title, s.description, s.icon, s.order);
}

console.log("✅ Migration média terminée.");
sql.close();
