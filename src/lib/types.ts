import type { ShopCurrency } from "./currency";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  category: string;
  image: string;
  imageAlt?: string;
  imageFocal?: { x: number; y: number };
  gallery?: { url: string; alt: string; focal?: { x: number; y: number } }[];
  featured: boolean;
  stock: number;
};

export type PaymentMethod = "card" | "cod";

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderLine = {
  productId: string;
  name: string;
  quantity: number;
  priceCents: number;
  unitMinor?: number;
};

export type OrderCustomer = {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

export type PendingCheckout = {
  id?: string;
  createdAt?: string;
  currency?: ShopCurrency;
  customer?: OrderCustomer;
  userId?: string;
  items: {
    productId: string;
    slug: string;
    name: string;
    priceCents: number;
    image: string;
    quantity: number;
  }[];
};

export type Order = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  customer: OrderCustomer;
  lines: OrderLine[];
  totalCents: number;
  totalMinor?: number;
  currency?: ShopCurrency;
  userId?: string;
  stripeSessionId?: string;
  trackingNote?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  passwordHash?: string;
  createdAt: string;
};
