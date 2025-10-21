import { processTranscriptWithGemini } from "./gemini.js";
// Handler pre Vercel Serverless Function
export default async function handler(request, response) {
  // Povolenie CORS
  response.setHeader("Access-Control-Allow-Credentials", true);
  response.setHeader("Access-Control-Allow-Origin", "*"); // Alebo špecifická doména
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(200).end();
    return;
  }
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // Načítanie API kľúča z Environment Variables Vercelu
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      "Serverless fn error: GEMINI_API_KEY not set in Vercel environment!"
    );
    return response.status(500).json({ error: "API key not configured" });
  }

  try {
    // Predpokladáme, že Vercel parsuje JSON telo automaticky
    const { transcript, language } = request.body;

    if (!transcript) {
      return response.status(400).json({ error: "Missing transcript" });
    }

    // Zavoláme našu logiku a odovzdáme jej API kľúč
    const commandData = await processTranscriptWithGemini(
      transcript,
      language || "sk-SK",
      apiKey
    );

    console.log("Serverless fn: Sending response:", commandData);
    response.status(200).json(commandData); // Odpoveď
  } catch (error) {
    console.error("Serverless fn error:", error);
    response
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}