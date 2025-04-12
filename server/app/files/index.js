import express from "express";
import { uploadFile, getNotes, getNoteById } from "./controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
});
const upload = multer({ storage });

// File routes
router.post("/upload", upload.single("file"), uploadFile);
router.get("/notes", getNotes);
router.get("/notes/:id", getNoteById);
export default router;
