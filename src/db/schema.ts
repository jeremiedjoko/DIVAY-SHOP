import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// ─── UTILISATEURS & ROLES ──────────────────────────────────────────────────
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  isActive: integer('is_active').default(1).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

export const roles = sqliteTable('roles', {
  id: text('id').primaryKey(),
  name: text('name').unique().notNull(),
  description: text('description'),
});

export const userRoles = sqliteTable('user_roles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  roleId: text('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
});

// ─── CATALOGUE & PRODUITS ──────────────────────────────────────────────────
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description').notNull(),
  priceMinor: integer('price_minor').notNull(),
  comparePrice: integer('compare_price'),
  categoryId: text('category_id').notNull().references(() => categories.id),
  // Utiliser integer simple (0/1) pour éviter les conflits de type Drizzle SQLite
  isFeatured: integer('is_featured').default(0).notNull(),
  isActive: integer('is_active').default(1).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  order: integer('order').default(0).notNull(),
});

export const inventory = sqliteTable('inventory', {
  id: text('id').primaryKey(),
  productId: text('product_id').unique().notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').default(0).notNull(),
});

// ─── RELATIONS ─────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  roles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
  inventory: one(inventory, { fields: [products.id], references: [inventory.productId] }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, { fields: [inventory.productId], references: [products.id] }),
}));

// ─── PROMOTIONS (COUPONS) ──────────────────────────────────────────────────
export const coupons = sqliteTable('coupons', {
  id: text('id').primaryKey(),
  code: text('code').unique().notNull(), // ex: DIVAY20
  discountPct: integer('discount_pct'), // Pourcentage de réduction (ex: 20)
  discountFix: integer('discount_fix'), // Réduction fixe en centimes
  usageLimit: integer('usage_limit'), // Limite d'utilisation (null = illimité)
  usedCount: integer('used_count').default(0).notNull(),
  isActive: integer('is_active').default(1).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

// ─── COMMANDES ─────────────────────────────────────────────────────────────
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').unique().notNull(), // ex: DIV-8A3B
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }), // null si achat invité
  status: text('status').default('PENDING').notNull(),
  totalMinor: integer('total_minor').notNull(),
  currency: text('currency').default('USD').notNull(),
  paymentMethod: text('payment_method').default('COD').notNull(),
  
  // Infos livraison snapshot
  shippingName: text('shipping_name').notNull(),
  shippingEmail: text('shipping_email').notNull(),
  shippingPhone: text('shipping_phone').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  shippingCity: text('shipping_city').notNull(),
  
  trackingNote: text('tracking_note'), // "Colis remis au livreur..."
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

export const orderLines = sqliteTable('order_lines', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => products.id, { onDelete: 'set null' }),
  productName: text('product_name').notNull(), // Snapshot du nom au moment de l'achat
  quantity: integer('quantity').notNull(),
  priceMinor: integer('price_minor').notNull(), // Snapshot du prix
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  lines: many(orderLines),
}));

export const orderLinesRelations = relations(orderLines, ({ one }) => ({
  order: one(orders, { fields: [orderLines.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderLines.productId], references: [products.id] }),
}));
