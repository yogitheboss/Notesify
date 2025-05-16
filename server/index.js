import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./mongodb.js";
import { registerApps } from "./app/index.js";
import fs from "fs";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

// Initialize express app and server
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Create uploads directory if it doesn't exist
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Connect to MongoDB
connectDB();

// Register all application routes
const apiRouter = express.Router();
registerApps(apiRouter);
app.use("/api", apiRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app };
