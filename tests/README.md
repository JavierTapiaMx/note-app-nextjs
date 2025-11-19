# Testing Guide

This project uses Vitest for unit testing with a focus on form validation and business rules.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Test Structure

### Validation Tests

Location: `lib/validations/noteValidation.test.ts`

Tests cover:
- **Title validation**
  - Minimum length (1 character)
  - Maximum length (255 characters)
  - Required field validation
  - Edge cases (empty, whitespace, special characters)

- **Content validation**
  - Minimum length (1 character)
  - Required field validation
  - Long content handling
  - Newlines and special characters

- **Schema variants**
  - `noteFormSchema` - Client-side form validation
  - `noteSchema` - Full note with optional ID
  - `createNoteSchema` - Create operations (no ID)
  - `updateNoteSchema` - Partial updates (no ID)

## Test Coverage

The validation tests ensure:
- ✅ Business rules are enforced (title max 255 chars, required fields)
- ✅ Error messages are consistent and user-friendly
- ✅ Edge cases are handled properly
- ✅ Partial updates work correctly
- ✅ Schema variations work as expected

## Writing New Tests

Follow these best practices:
1. Use descriptive test names
2. Group related tests with `describe` blocks
3. Test both success and failure cases
4. Test edge cases and boundary conditions
5. Use constants from validation schemas for maintainability

Example:
```typescript
describe("Feature Name", () => {
  it("should pass when input is valid", () => {
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail when input is invalid", () => {
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
```

## Next Steps

After running `pnpm install`, you should:
1. Update your existing files to use the new shared validation schemas
2. Run the tests: `pnpm test`
3. Check coverage: `pnpm test:coverage`
4. Add more tests for other business rules as needed
