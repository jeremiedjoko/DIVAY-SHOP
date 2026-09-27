import bcrypt from "bcryptjs";
import { promises as fs } from "fs";
import path from "path";
import type { User } from "./types";

const USERS_PATH = path.join(process.cwd(), "data", "users.json");

async function ensureUsersFile(): Promise<void> {
  try {
    await fs.access(USERS_PATH);
  } catch {
    await fs.mkdir(path.dirname(USERS_PATH), { recursive: true });
    await fs.writeFile(USERS_PATH, "[]", "utf-8");
  }
}

async function readUsers(): Promise<User[]> {
  await ensureUsersFile();
  const raw = await fs.readFile(USERS_PATH, "utf-8");
  return JSON.parse(raw) as User[];
}

async function writeUsers(users: User[]): Promise<void> {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), "utf-8");
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}

export async function createUser(input: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}): Promise<User> {
  const users = await readUsers();
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("EMAIL_EXISTS");
  }
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user: User = {
    id: crypto.randomUUID(),
    email: input.email.toLowerCase(),
    passwordHash,
    name: input.name,
    phone: input.phone,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeUsers(users);
  return user;
}

export async function verifyUserPassword(
  email: string,
  password: string,
): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}
