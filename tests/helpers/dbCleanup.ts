import { db } from "@/db/drizzle";
import { notesTable } from "@/db/schema";
import { like } from "drizzle-orm";
import { TEST_PREFIX } from "./testData";

export const cleanupTestNotes = async (): Promise<void> => {
  await db.delete(notesTable).where(like(notesTable.title, `${TEST_PREFIX}%`));
};

export const cleanupNoteById = async (id: number): Promise<void> => {
  await db.delete(notesTable).where(like(notesTable.title, `${TEST_PREFIX}%`));
};
