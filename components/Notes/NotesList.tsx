import type Note from "@/types/Note";
import NoteCard from "@/components/Notes/NoteCard";

interface Props {
  notes: Note[];
}

const NotesList = ({ notes }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};

export default NotesList;
