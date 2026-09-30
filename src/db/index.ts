import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

let dbPath = './sqlite.db';

// VERCEL HACK: Le système de fichiers est en lecture seule sauf le dossier /tmp
if (process.env.VERCEL || process.env.VERCEL_ENV) {
  dbPath = '/tmp/sqlite.db';
  if (!fs.existsSync(dbPath)) {
    const originalPath = path.join(process.cwd(), 'sqlite.db');
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, dbPath);
    }
  }
}

const sqlite = new Database(dbPath);

// Création idempotente de la table des rendez-vous (pas de migration nécessaire)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    reference TEXT NOT NULL UNIQUE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    service_slug TEXT NOT NULL,
    service_name TEXT NOT NULL,
    price_fc INTEGER NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE INDEX IF NOT EXISTS idx_appointments_slot ON appointments(date, time);
`);

// Colonne ajoutée après coup : migration idempotente
const orderCols = sqlite.prepare("PRAGMA table_info(orders)").all() as { name: string }[];
if (orderCols.length > 0 && !orderCols.some((c) => c.name === "stripe_session_id")) {
  sqlite.exec("ALTER TABLE orders ADD COLUMN stripe_session_id TEXT");
}

export const db = drizzle(sqlite, { schema });
