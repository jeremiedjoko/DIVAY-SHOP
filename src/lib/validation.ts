import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(6).max(30),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  postalCode: z.string().min(2).max(12),
});

export const checkoutBodySchema = z.object({
  currency: z.enum(["USD", "CDF"]),
  customer: customerSchema,
  items: z.array(
    z.object({
      productId: z.string(),
      slug: z.string(),
      name: z.string(),
      priceUsdCents: z.number(),
      image: z.string(),
      quantity: z.number().int().min(1).max(20),
    }),
  ),
});
