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
export const db = drizzle(sqlite, { schema });
