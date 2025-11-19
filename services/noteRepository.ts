import { db } from "@/db/drizzle";
import { notesTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

type NoteRow = InferSelectModel<typeof notesTable>;

export class NoteRepository {
  async findAll(): Promise<NoteRow[]> {
    return await db
      .select()
      .from(notesTable)
      .orderBy(desc(notesTable.createdAt));
  }

  async findById(id: number): Promise<NoteRow | null> {
    const notes = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.id, id))
      .limit(1);

    return notes[0] ?? null;
  }

  async create(data: { title: string; content: string }): Promise<number> {
    const newNoteId = await db
      .insert(notesTable)
      .values({
        title: data.title,
        content: data.content
      })
      .$returningId();

    return newNoteId[0].id;
  }

  async update(
    id: number,
    data: Partial<{ title: string; content: string }>
  ): Promise<NoteRow | null> {
    await db
      .update(notesTable)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(notesTable.id, id));

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await db.delete(notesTable).where(eq(notesTable.id, id));
  }

  async exists(id: number): Promise<boolean> {
    const note = await this.findById(id);
    return note !== null;
  }
}

export const noteRepository = new NoteRepository();
