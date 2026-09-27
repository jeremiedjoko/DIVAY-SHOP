export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Montant en centimes USD (référence catalogue) */
  priceUsdCents: number;
  category: string;
  image: string;
  featured: boolean;
  stock: number;
};

export type PaymentMethod = "card" | "cod";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderLine = {
  productId: string;
  name: string;
  quantity: number;
  priceUsdCents: number;
  unitMinor: number;
};

export type OrderCustomer = {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

export type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  customer: OrderCustomer;
  lines: OrderLine[];
  currency: "USD" | "CDF";
  totalMinor: number;
  userId?: string;
  stripeSessionId?: string;
  trackingNote?: string;
};

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  createdAt: string;
};

export type PendingCheckout = {
  id: string;
  createdAt: string;
  currency: "USD" | "CDF";
  customer: OrderCustomer;
  items: {
    productId: string;
    slug: string;
    name: string;
    priceUsdCents: number;
    image: string;
    quantity: number;
  }[];
  userId?: string;
};

export type PublicUser = Pick<User, "id" | "email" | "name" | "phone" | "createdAt">;
