import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Création ou connexion à un fichier local SQLite
const sqlite = new Database('./sqlite.db');

export const db = drizzle(sqlite, { schema });
