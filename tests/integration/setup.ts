import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { cleanupTestNotes } from "../helpers/dbCleanup";

beforeAll(async () => {
  console.log("🧹 Cleaning up any existing test data before all tests...");
  await cleanupTestNotes();
});

beforeEach(async () => {
  console.log("🧪 Starting new test...");
});

afterEach(async () => {
  console.log("🧹 Cleaning up after test...");
  await cleanupTestNotes();
});

afterAll(async () => {
  console.log("✅ All integration tests completed. Final cleanup...");
  await cleanupTestNotes();
});
