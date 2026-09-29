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

export type OrderLine = {
  productId: string;
  name: string;
  quantity: number;
  priceCents: number;
};

export type Order = {
  id: string;
  createdAt: string;
  paymentMethod: PaymentMethod;
  status: "pending" | "paid" | "shipped" | "delivered";
  customer: {
    email: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  lines: OrderLine[];
  totalCents: number;
};
