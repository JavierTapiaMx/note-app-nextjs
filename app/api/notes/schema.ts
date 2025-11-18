import { z } from "zod";

export const noteSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  content: z.string().min(1, "Content is required")
});

export type Note = z.infer<typeof noteSchema>;
