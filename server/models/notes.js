import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: String,
    content: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transcript: String,
  },
  {
    timestamps: true,
  }
);

const NoteModel = mongoose.model("Note", noteSchema);

export { NoteModel };
