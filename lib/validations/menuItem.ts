import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  price: z.number().min(0, "Price must be a valid positive number"),
  imageUrl: z.string().url().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  dietaryTags: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  notes: z.string().optional().nullable(),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
