import Link from "next/link";
import type Note from "@/types/Note";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

interface Props {
  note: Note;
}

const NoteCard = ({ note }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link
            href={`/notes/${note.id}/edit`}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            {note.title}
          </Link>
        </CardTitle>
        <CardDescription>{note.content}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default NoteCard;
