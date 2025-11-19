import { z } from "zod";

export const VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 255,
  CONTENT_MIN_LENGTH: 1
} as const;

export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: "Title is required",
  TITLE_TOO_LONG: "Title is too long",
  CONTENT_REQUIRED: "Content is required"
} as const;

export const noteFormSchema = z.object({
  title: z
    .string()
    .min(VALIDATION_RULES.TITLE_MIN_LENGTH, VALIDATION_MESSAGES.TITLE_REQUIRED)
    .max(VALIDATION_RULES.TITLE_MAX_LENGTH, VALIDATION_MESSAGES.TITLE_TOO_LONG),
  content: z
    .string()
    .min(
      VALIDATION_RULES.CONTENT_MIN_LENGTH,
      VALIDATION_MESSAGES.CONTENT_REQUIRED
    )
});

export const noteSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(VALIDATION_RULES.TITLE_MIN_LENGTH, VALIDATION_MESSAGES.TITLE_REQUIRED)
    .max(VALIDATION_RULES.TITLE_MAX_LENGTH, VALIDATION_MESSAGES.TITLE_TOO_LONG),
  content: z
    .string()
    .min(
      VALIDATION_RULES.CONTENT_MIN_LENGTH,
      VALIDATION_MESSAGES.CONTENT_REQUIRED
    )
});

export const createNoteSchema = noteSchema.omit({ id: true });
export const updateNoteSchema = noteSchema.partial().omit({ id: true });

export type NoteFormData = z.infer<typeof noteFormSchema>;
export type NoteData = z.infer<typeof noteSchema>;
