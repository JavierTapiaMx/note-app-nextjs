import ApiClient from "./apiClient";
import Note from "../types/Note";

const noteService = new ApiClient<Note>("/notes");

export default noteService;
