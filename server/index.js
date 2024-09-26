import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import { createClient } from "@deepgram/sdk";
import fs from "fs";
import multer from "multer";

dotenv.config();
const port = 3000;
app.use(express.json());
app.use(cors());

const transcribeFile = async (filePath) => {
  const deepgram = createClient(process.env.DEEPGRAM);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    fs.readFileSync(filePath),
    {
      model: "nova-2",
      smart_format: true,
    }
  );

  if (error) throw error;
  if (!error) console.dir(result, { depth: null });
  return result;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
});
const upload = multer({ storage });
app.post("/upload_files", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const transcriptionResult = await transcribeFile(filePath);
    const result =
      transcriptionResult.results.channels[0].alternatives[0].transcript;
    res.json({
      message: "Successfully uploaded and transcribed file",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error uploading or transcribing file",
      error: error.message,
    });
  }
});
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("app is rnnign");
});
