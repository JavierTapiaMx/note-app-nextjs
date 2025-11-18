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
        <CardTitle>{note.title}</CardTitle>
        <CardDescription>{note.content}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default NoteCard;
