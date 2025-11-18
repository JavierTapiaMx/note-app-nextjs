import { sql } from "drizzle-orm";
import {
  datetime,
  mysqlTable,
  serial,
  text,
  varchar
} from "drizzle-orm/mysql-core";

export const notesTable = mysqlTable("notes", {
  id: serial().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  content: text().notNull(),
  createdAt: datetime({ mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime({ mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date())
});
