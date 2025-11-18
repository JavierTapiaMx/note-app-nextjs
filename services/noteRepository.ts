import { db } from "@/db/drizzle";
import { notesTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export class NoteRepository {
  async findAll() {
    return await db
      .select()
      .from(notesTable)
      .orderBy(desc(notesTable.createdAt));
  }

  async findById(id: number) {
    const notes = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.id, id))
      .limit(1);

    return notes[0] ?? null;
  }

  async create(data: { title: string; content: string }) {
    const newNoteId = await db
      .insert(notesTable)
      .values({
        title: data.title,
        content: data.content
      })
      .$returningId();

    return newNoteId[0].id;
  }

  async update(id: number, data: Partial<{ title: string; content: string }>) {
    await db
      .update(notesTable)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(notesTable.id, id));

    return this.findById(id);
  }

  async delete(id: number) {
    await db.delete(notesTable).where(eq(notesTable.id, id));
  }

  async exists(id: number): Promise<boolean> {
    const note = await this.findById(id);
    return note !== null;
  }
}

export const noteRepository = new NoteRepository();
