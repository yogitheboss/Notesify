import express from "express";
import { login, signup } from "./controller.js";

const router = express.Router();

// Auth routes
router.post("/login", login);
router.post("/signup", signup);

export default router;
