# Migration Guide: Using Shared Validation Schemas

## Overview

The new shared validation schemas in `lib/validations/noteValidation.ts` provide a single source of truth for validation rules, making them easier to test and maintain.

## Files to Update

### 1. NoteForm Component

**File:** `components/Notes/NoteForm.tsx`

**Before:**
```typescript
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  content: z.string().min(1, "Content is required")
});
```

**After:**
```typescript
import { noteFormSchema } from "@/lib/validations/noteValidation";

// Remove the local formSchema and use the imported one
const form = useForm<FormData>({
  resolver: zodResolver(noteFormSchema),
  // ... rest of config
});
```

### 2. API Route Schema

**File:** `app/api/notes/schema.ts`

**Before:**
```typescript
export const noteSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  content: z.string().min(1, "Content is required")
});

export const createNoteSchema = noteSchema.omit({ id: true });
export const updateNoteSchema = noteSchema.partial().omit({ id: true });
```

**After:**
```typescript
export {
  noteSchema,
  createNoteSchema,
  updateNoteSchema
} from "@/lib/validations/noteValidation";
```

## Benefits

1. **Single Source of Truth**: Validation rules are defined once
2. **Testability**: Easy to unit test without rendering components
3. **Consistency**: Same validation on client and server
4. **Maintainability**: Changes to validation rules update everywhere
5. **Type Safety**: Shared types ensure consistency

## Validation Rules Reference

```typescript
VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 255,
  CONTENT_MIN_LENGTH: 1
}

VALIDATION_MESSAGES = {
  TITLE_REQUIRED: "Title is required",
  TITLE_TOO_LONG: "Title is too long",
  CONTENT_REQUIRED: "Content is required"
}
```

## Next Steps

1. Run `pnpm install` to install testing dependencies
2. Update the files mentioned above to use shared schemas
3. Run tests: `pnpm test`
4. Verify everything works: `pnpm dev`
