import { generateNotes, transcribeFile } from "./service.js";
import { NoteModel } from "../../models/notes.js";
/**
 * Handle file upload and transcription
 */
export const uploadFile = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Request files:", req.files);
    const user = req.user;
    console.log("User:", user);
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        error:
          "File is required. Make sure you're sending the file with the field name 'file' and using multipart/form-data encoding.",
      });
    }

    const filePath = req.file.path;
    const transcriptionResult = await transcribeFile(filePath);
    const result =
      transcriptionResult.results.channels[0].alternatives[0].transcript;
    const prompt = `You are a notemaker for students. elaborate on topics discussed in the transcript given. Create a note from the lecture transcript and also provide proper title for the note: ${result} return the response in json format as {
      "title": "Title of the note",
      "content": "Content of the note(in markdown format)"
    }`;
    const notes = await generateNotes(prompt);
    const note = await NoteModel.create({
      title: notes.title,
      content: notes.content,
      userId: user.id,
      transcript: result,
      internetGenNotes: notes.internetGenNotes,
    });
    res.json({
      message: "Successfully uploaded and transcribed file",
      data: result,
      notes: notes.content,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error uploading or transcribing file",
      error: error.message,
    });
  }
};

export const getNotes = async (req, res) => {
  const user = req.user;
  console.log("User:", user);
  const notes = await NoteModel.find({ userId: user.id });
  console.log("Notes:", notes);
  res.json({ notes });
};

export const getNoteById = async (req, res) => {
  const { id } = req.params;
  const note = await NoteModel.findById(id);
  console.log("Note:", note);
  res.json({ note });
};
