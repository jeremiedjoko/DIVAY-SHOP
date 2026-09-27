import { db } from './index';
import { users, roles, userRoles, categories, products, productImages, inventory } from './schema';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

async function main() {
  console.log('🌱 Démarrage du seed Drizzle (SQLite)...');

  const roleNames = ['CLIENT', 'VENDEUSE', 'LIVREUR', 'SUPPORT', 'SUPER_ADMIN'] as const;

  for (const rName of roleNames) {
    const existing = await db.select().from(roles).where(eq(roles.name, rName));
    if (existing.length === 0) {
      await db.insert(roles).values({ id: randomUUID() as string, name: rName });
    }
  }

  const allRoles = await db.select().from(roles).where(eq(roles.name, 'SUPER_ADMIN'));
  const adminRole = allRoles[0];
  const adminEmail = 'admin@divaybeauty.com';
  const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail));

  if (existingAdmin.length === 0 && adminRole) {
    const hashedPassword = await bcrypt.hash('divay-admin-2024', 10);
    const adminId = randomUUID() as string;
    await db.insert(users).values({
      id: adminId,
      email: adminEmail,
      passwordHash: hashedPassword,
      name: 'Divay Admin',
    });
    await db.insert(userRoles).values({
      id: randomUUID() as string,
      userId: adminId,
      roleId: adminRole.id,
    });
    console.log('✅ Admin par défaut créé : admin@divaybeauty.com / divay-admin-2024');
  }

  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  let productsData: Array<{
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    image?: string;
    featured?: boolean;
  }> = [];

  try {
    productsData = JSON.parse(await fs.readFile(productsPath, 'utf8'));
  } catch (_) {}

  if (productsData.length > 0) {
    let catId: string;
    const existingCat = await db.select().from(categories).where(eq(categories.slug, 'soins'));
    if (existingCat.length === 0) {
      catId = randomUUID() as string;
      await db.insert(categories).values({ id: catId, name: 'Soins & Beauté', slug: 'soins' });
    } else {
      catId = existingCat[0].id;
    }

    for (const p of productsData) {
      const productSlug = p.id || (randomUUID() as string);
      const existingP = await db.select().from(products).where(eq(products.slug, productSlug));

      if (existingP.length === 0) {
        const pId = randomUUID() as string;
        await db.insert(products).values({
          id: pId,
          name: p.name || 'Produit sans nom',
          slug: productSlug,
          description: p.description || 'Description non fournie',
          priceMinor: p.price ? Math.round(p.price * 100) : 0,
          categoryId: catId,
          isFeatured: p.featured ? 1 : 0,
          isActive: 1,
        });

        await db.insert(productImages).values({
          id: randomUUID() as string,
          productId: pId,
          url: p.image || '/placeholder.png',
        });

        await db.insert(inventory).values({
          id: randomUUID() as string,
          productId: pId,
          quantity: p.stock || 10,
        });
      }
    }
    console.log(`✅ ${productsData.length} produits migrés !`);
  }

  console.log('✨ Seed terminé !');
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
