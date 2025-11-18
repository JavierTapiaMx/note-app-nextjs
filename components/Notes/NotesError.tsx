interface Props {
  error?: Error | null;
}

const NotesError = ({ error }: Props) => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const errorMessage =
    error instanceof Error
      ? error.message
      : "An error occurred while fetching notes.";

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <h3 className="mb-2 font-semibold text-red-700">Failed to load notes</h3>
      <p className="text-sm text-red-600">
        {isDevelopment
          ? errorMessage
          : "An error occurred while fetching notes. Please try again later."}
      </p>
      {isDevelopment && error?.stack && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-red-500 hover:text-red-700">
            Stack trace (dev only)
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 text-xs text-red-500">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};

export default NotesError;
