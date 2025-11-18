const NotesEmpty = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
      <p className="text-gray-600">No notes available.</p>
      <p className="mt-2 text-sm text-gray-500">
        Create your first note to get started.
      </p>
    </div>
  );
};

export default NotesEmpty;
