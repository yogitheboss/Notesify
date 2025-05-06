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

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "You must respond with valid JSON only. No markdown formatting, no backticks, no explanation text.",
  });

  try {
    // Extract key topics from transcript to search online
    const topicsPrompt = `Extract 3-5 key topics or questions from this transcript that would benefit from internet research. Return ONLY a JSON array of strings with no explanation:\n\n${transcript}`;
    const topicsResult = await model.generateContent(topicsPrompt);
    const topicsResponse = await topicsResult.response;
    const topicsText = topicsResponse.text().trim();

    let searchTopics = [];
    try {
      // Clean and parse the topics response
      let cleanedTopicsText = topicsText;
      if (cleanedTopicsText.startsWith("```json")) {
        cleanedTopicsText = cleanedTopicsText
          .replace(/^```json\n/, "")
          .replace(/\n```$/, "");
      } else if (cleanedTopicsText.startsWith("```")) {
        cleanedTopicsText = cleanedTopicsText
          .replace(/^```\n/, "")
          .replace(/\n```$/, "");
      }
      searchTopics = JSON.parse(cleanedTopicsText);
    } catch (error) {
      console.error("Error parsing search topics:", error);
      searchTopics = ["main topic from transcript"];
    }

    // Fetch internet information using SERP API
    let internetGenNotes = "No additional information found.";
    try {
      const searchQuery = searchTopics.join(" ");
      const serpResponse = await fetch(
        `https://serpapi.com/search?q=${encodeURIComponent(
          searchQuery
        )}&api_key=${process.env.SERP_API}`
      );
      const serpData = await serpResponse.json();

      // Extract relevant information from SERP results
      if (serpData.organic_results && serpData.organic_results.length > 0) {
        const topResults = serpData.organic_results.slice(0, 3);
        const resultSummaries = topResults
          .map(
            (result) =>
              `## ${result.title}\n${result.snippet}\nSource: ${result.link}`
          )
          .join("\n\n");

        internetGenNotes = `# Additional Information from the Web\n\n${resultSummaries}`;
      }
    } catch (error) {
      console.error("Error fetching data from SERP API:", error);
      internetGenNotes =
        "Error fetching additional information from the internet.";
    }

    // Generate notes from transcript
    const prompt = `Generate concise, structured notes from this transcript in JSON format with 'title' and 'content' fields. The content should include markdown formatting for headings and bullet points. Respond with ONLY valid JSON:\n\n${transcript}`;

    const result = await model.generateContent(prompt);
    const mainResponse = await result.response;
    const responseText = mainResponse.text().trim();

    let cleanedText = responseText;
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    const jsonResponse = JSON.parse(cleanedText);
    console.log("internetGenNotes", internetGenNotes);
    // Add internet research to the response
    jsonResponse.internetGenNotes = internetGenNotes;

    return jsonResponse;
  } catch (error) {
    console.error("Error generating or parsing notes:", error);
    return {
      title: "Notes from Transcript",
      content: "Unable to generate structured notes from the transcript.",
      internetGenNotes: "Unable to fetch additional information.",
    };
  }
};
