import { promises as fs } from "fs";
import path from "path";
import type { PendingCheckout } from "./types";

const PENDING_PATH = path.join(process.cwd(), "data", "pending-checkouts.json");

async function ensureFile(): Promise<void> {
  try {
    await fs.access(PENDING_PATH);
  } catch {
    await fs.mkdir(path.dirname(PENDING_PATH), { recursive: true });
    await fs.writeFile(PENDING_PATH, "[]", "utf-8");
  }
}

async function readAll(): Promise<PendingCheckout[]> {
  await ensureFile();
  const raw = await fs.readFile(PENDING_PATH, "utf-8");
  return JSON.parse(raw) as PendingCheckout[];
}

async function writeAll(items: PendingCheckout[]): Promise<void> {
  await fs.writeFile(PENDING_PATH, JSON.stringify(items, null, 2), "utf-8");
}

export async function savePendingCheckout(
  checkout: Omit<PendingCheckout, "id" | "createdAt">,
): Promise<PendingCheckout> {
  const items = await readAll();
  const record: PendingCheckout = {
    ...checkout,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  items.push(record);
  await writeAll(items);
  return record;
}

export async function consumePendingCheckout(id: string): Promise<PendingCheckout | null> {
  const items = await readAll();
  const index = items.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const [record] = items.splice(index, 1);
  await writeAll(items);
  return record;
}
