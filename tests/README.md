# Testing Guide

This project uses Vitest for both **unit testing** (validation schemas) and **integration testing** (API to database).

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Ensure your database is running and `.env.local` is configured with `DATABASE_URL`

## Running Tests

```bash
# Run all tests (unit + integration)
pnpm test

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration

# Run tests in watch mode
pnpm test -- --watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Test Structure

### Unit Tests - Validation

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

### Integration Tests - API to Database

Location: `tests/integration/api/notes/`

Tests cover:
- **Create Note** (`create.test.ts`)
  - POST /api/notes endpoint
  - Database persistence
  - Validation errors
  - Edge cases (11 test cases)

- **Update Note** (`update.test.ts`)
  - PATCH /api/notes/:id endpoint
  - Partial updates
  - Timestamp updates
  - Not found scenarios (15 test cases)

- **Get Single Note** (`get-single.test.ts`)
  - GET /api/notes/:id endpoint
  - Data consistency
  - Invalid ID handling (13 test cases)

**⚠️ Important**: Integration tests run against your actual database with `[TEST]` prefix for safety. Automatic cleanup runs after each test.

See [integration/README.md](integration/README.md) for detailed integration testing guide.

## Test Coverage Summary

### Unit Tests (60+ test cases)
- ✅ Business rules are enforced (title max 255 chars, required fields)
- ✅ Error messages are consistent and user-friendly
- ✅ Edge cases are handled properly
- ✅ Partial updates work correctly
- ✅ Schema variations work as expected

### Integration Tests (39 test cases)
- ✅ Full API → Database → Response flow
- ✅ Data persistence verification
- ✅ Error handling at all layers
- ✅ Edge cases and boundary conditions
- ✅ Data consistency checks

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
