import { createClient } from "@deepgram/sdk";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

/**
 * Transcribe an audio file using Deepgram
 * @param {string} filePath - Path to the audio file
 * @returns {Promise<object>} - Transcription result
 */
export const transcribeFile = async (filePath) => {
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

export const generateNotes = async (transcript) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(transcript);
  const mainResponse = await result.response;
  const text = mainResponse.text();
  console.log(text);
  return text;
};
