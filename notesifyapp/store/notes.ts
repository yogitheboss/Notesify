import apiClient from "@/utils/apiClient";
import { create } from "zustand";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  internetGenNotes: string;
}

interface NotesState {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  createNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNotes: () => Promise<void>;
  getNoteById: (id: string) => Promise<Note>;
  clearSelectedNote: () => void;
}

export const useNotesStore = create<NotesState>()((set) => ({
  notes: [],
  setNotes: (notes: Note[]) => set({ notes }),
  selectedNote: null,
  setSelectedNote: (note: Note | null) => set({ selectedNote: note }),

  createNote: async (title: string, content: string) => {
    try {
      const response = await apiClient.post("/notes", { title, content });
      set((state) => ({
        notes: [...state.notes, response.data.data],
      }));
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  },

  updateNote: async (id: string, title: string, content: string) => {
    try {
      const response = await apiClient.put(`/notes/${id}`, { title, content });
      set((state) => ({
        notes: state.notes.map((note) =>
          note._id === id ? response.data.data : note
        ),
        selectedNote:
          state.selectedNote?._id === id
            ? response.data.data
            : state.selectedNote,
      }));
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  },

  deleteNote: async (id: string) => {
    try {
      await apiClient.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((note) => note._id !== id),
        selectedNote:
          state.selectedNote?._id === id ? null : state.selectedNote,
      }));
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  },

  getNotes: async () => {
    try {
      const response = await apiClient.get("/api/files/notes");
      console.log("Response:", response.data, typeof response.data);
      set({ notes: response.data.notes || [] });
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw error;
    }
  },

  getNoteById: async (id: string) => {
    try {
      const response = await apiClient.get(`/api/files/notes/${id}`);
      const note = response.data.note;
      set((state) => ({
        selectedNote: note,
      }));
      return note;
    } catch (error) {
      console.error("Error fetching note:", error);
      throw error;
    }
  },

  clearSelectedNote: () => set({ selectedNote: null }),
}));
