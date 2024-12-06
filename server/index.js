import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import { createClient } from "@deepgram/sdk";
import fs from "fs";
import multer from "multer";
import { UserModel } from "./models/user.js";
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
app.post("login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  if (user.password !== password) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }
  res.json({
    message: "Successfully logged in",
    data: user,
  });
});
app.post("/signup", async (req, res) => {
  console.log("called", req.body);
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }
  try {
    const user = new UserModel({
      name: userName,
      email,
      password,
    });
    await user.save();
    res.json({
      message: "Successfully registered",
      data: user,
    });
  } catch (err) {}
});
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
export { app };
