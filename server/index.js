import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import { createClient } from "@deepgram/sdk";
import multer from "multer";
import axios from "axios";
dotenv.config();
const port = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/transcribe", upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer; // Get the file buffer

    // Send the file buffer to Deepgram API for transcription
    const response = await axios.post(
      "https://api.deepgram.com/v1/listen",
      fileBuffer,
      {
        headers: {
          "Content-Type": "audio/wav",
          Authorization: `Token YOUR_DEEPGRAM_API_KEY`, // Replace with your Deepgram API key
        },
      }
    );

    // Send the transcription back to the client
    res.json({
      transcription:
        response.data.results.channels[0].alternatives[0].transcript,
    });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).json({ error: "Error transcribing audio" });
  }
});
app.listen(port, () => {
  console.log("app is rnnign");
});
