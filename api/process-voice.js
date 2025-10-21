import { processTranscriptWithGemini } from '../src/gemini.js';

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("SERVER ERROR: GEMINI_API_KEY nie je nastavený!");
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'API kľúč nie je nakonfigurovaný.' }) };
    }

    const { transcript, language } = JSON.parse(event.body);

    if (!transcript) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Chýba prepis (transcript).' }) };
    }

    const commandData = await processTranscriptWithGemini(transcript, language, apiKey);

    return { statusCode: 200, headers, body: JSON.stringify(commandData) };

  } catch (error) {
    console.error('SERVER ERROR:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Nastala chyba pri spracovaní príkazu.' }) };
  }
};