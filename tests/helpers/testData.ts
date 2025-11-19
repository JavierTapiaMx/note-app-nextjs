export const TEST_PREFIX = "[TEST]";

export const createTestNoteData = (overrides?: {
  title?: string;
  content?: string;
}) => ({
  title: `${TEST_PREFIX} ${overrides?.title ?? "Test Note Title"}`,
  content: overrides?.content ?? "Test note content"
});

export const isTestNote = (title: string): boolean =>
  title.startsWith(TEST_PREFIX);
