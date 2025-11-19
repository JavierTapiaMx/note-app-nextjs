# Integration Testing Guide

This directory contains end-to-end integration tests that test the full flow from API routes to the database.

## Overview

Integration tests verify that all layers of the application work together correctly:
- **API Routes** → **Repository** → **Database** → **Response**

## Test Structure

```
tests/integration/
├── api/
│   └── notes/
│       ├── create.test.ts      # POST /api/notes tests
│       ├── update.test.ts      # PATCH /api/notes/:id tests
│       └── get-single.test.ts  # GET /api/notes/:id tests
├── setup.ts                    # Integration test setup
└── README.md                   # This file

tests/helpers/
├── testData.ts                 # Test data generators
└── dbCleanup.ts                # Database cleanup utilities
```

## Safety Measures

Since these tests run against the same database, we've implemented safety measures:

1. **Test Prefix**: All test data uses `[TEST]` prefix in titles
2. **Automatic Cleanup**: Tests clean up after themselves
3. **Before/After Hooks**: Cleanup runs before and after each test
4. **Final Cleanup**: Cleanup runs after all tests complete

## Running Integration Tests

```bash
# Run all integration tests
pnpm test:integration

# Run specific test file
pnpm vitest tests/integration/api/notes/create.test.ts

# Run in watch mode
pnpm test:integration -- --watch

# Run with UI
pnpm vitest tests/integration --ui
```

## Test Coverage

### Create Note Tests (POST /api/notes)
- ✅ Create note with valid data (201 response)
- ✅ Persist note in database
- ✅ Handle special characters
- ✅ Accept maximum title length (255 chars)
- ✅ Validate missing title (400 error)
- ✅ Validate missing content (400 error)
- ✅ Validate empty fields (400 error)
- ✅ Validate title exceeds max length (400 error)
- ✅ Handle invalid JSON (400 error)
- ✅ Accept minimum title length (1 char)
- ✅ Handle very long content

**Total: 11 test cases**

### Update Note Tests (PATCH /api/notes/:id)
- ✅ Update both title and content
- ✅ Update only title (partial update)
- ✅ Update only content (partial update)
- ✅ Persist update in database
- ✅ Handle special characters
- ✅ Update timestamp (updatedAt)
- ✅ Validate empty title (400 error)
- ✅ Validate empty content (400 error)
- ✅ Validate title exceeds max length (400 error)
- ✅ Handle invalid JSON (400 error)
- ✅ Return 404 for non-existent note
- ✅ Return 400 for invalid ID
- ✅ Update to minimum title length
- ✅ Update to maximum title length
- ✅ Update to very long content

**Total: 15 test cases**

### Get Single Note Tests (GET /api/notes/:id)
- ✅ Retrieve note by valid ID
- ✅ Return correct data types
- ✅ Retrieve note with special characters
- ✅ Retrieve note with very long content
- ✅ Retrieve note with maximum title length
- ✅ Return 404 for non-existent note
- ✅ Return 404 for deleted note
- ✅ Return 400 for invalid ID (non-numeric)
- ✅ Return 404 for negative ID
- ✅ Return 404 for zero ID
- ✅ Return 404 for decimal ID
- ✅ Data consistency across multiple fetches
- ✅ Match data from repository directly

**Total: 13 test cases**

## What Gets Tested

### API Layer
- HTTP request/response handling
- Status codes (200, 201, 400, 404, 500)
- JSON request body parsing
- Error responses

### Validation Layer
- Zod schema validation
- Title/content length requirements
- Required field validation
- Error message format

### Repository Layer
- Database operations (create, read, update)
- Data persistence
- Query results

### End-to-End Flow
- Complete request → response cycle
- Data transformation between layers
- Timestamp handling (createdAt, updatedAt)
- Data consistency

## Database Cleanup Strategy

### Automatic Cleanup Hooks

```typescript
beforeAll()   → Clean all test data before starting
beforeEach()  → Log test start
afterEach()   → Clean up after each test
afterAll()    → Final cleanup after all tests
```

### Manual Cleanup

If tests fail and leave data behind:

```typescript
import { cleanupTestNotes } from "@/tests/helpers/dbCleanup";

// Clean up manually
await cleanupTestNotes();
```

Or directly in MySQL:

```sql
DELETE FROM notes WHERE title LIKE '[TEST]%';
```

## Best Practices

1. **Always use test data helpers**
   ```typescript
   import { createTestNoteData } from "../../../helpers/testData";
   const noteData = createTestNoteData({ title: "Custom Title" });
   ```

2. **Clean up in afterEach**
   ```typescript
   afterEach(async () => {
     await cleanupTestNotes();
   });
   ```

3. **Test both success and failure cases**
   - Valid inputs → successful operations
   - Invalid inputs → proper error handling

4. **Test edge cases**
   - Minimum/maximum lengths
   - Special characters
   - Very long content

5. **Verify database persistence**
   - Check that data was actually saved
   - Verify updates were applied
   - Confirm deletions worked

## Writing New Integration Tests

Example structure:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "@/app/api/your-route/route";
import { yourRepository } from "@/services/yourRepository";
import { createTestData } from "../../helpers/testData";
import { NextRequest } from "next/server";
import "../setup";

describe("Your Integration Test", () => {
  let testId: number;

  beforeEach(async () => {
    // Create test data
    const data = createTestData();
    testId = await yourRepository.create(data);
  });

  describe("successful scenarios", () => {
    it("should do something successfully", async () => {
      const request = new NextRequest("http://localhost:3000/api/your-route");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("expectedProperty");
    });
  });

  describe("error scenarios", () => {
    it("should handle errors properly", async () => {
      // Test error cases
    });
  });
});
```

## Troubleshooting

### Tests are failing with database connection errors
- Ensure your `.env.local` has correct `DATABASE_URL`
- Make sure your MySQL server is running
- Check that the database exists

### Tests leave data behind
- Run manual cleanup: `await cleanupTestNotes()`
- Or use SQL: `DELETE FROM notes WHERE title LIKE '[TEST]%'`

### Tests interfere with each other
- Ensure you're using unique test data
- Check that cleanup is running in `afterEach`
- Run tests sequentially: `pnpm test:integration -- --no-threads`

### Timeout errors
- Increase Vitest timeout in test file:
  ```typescript
  it("slow test", async () => {
    // test code
  }, { timeout: 10000 }); // 10 second timeout
  ```

## Performance Tips

- Integration tests are slower than unit tests
- Run unit tests during development: `pnpm test:unit`
- Run integration tests before commits: `pnpm test:integration`
- Use watch mode for faster feedback: `pnpm test:integration -- --watch`

## Next Steps

Consider adding integration tests for:
- DELETE /api/notes/:id
- GET /api/notes (list all notes)
- Concurrent operations
- Database transaction rollback scenarios
- Error recovery scenarios
