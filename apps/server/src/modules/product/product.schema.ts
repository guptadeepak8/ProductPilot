import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(3).max(100),

  price: z.number().positive(),

  image: z.string().nullable().default(null),

  categoryId: z.number().int().positive(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
