import { processTranscriptWithGemini } from '../src/gemini.js';

export const handler = async (event) => {
  // Hlavičky pre CORS (povolí komunikáciu s tvojou stránkou)
  const headers = {
    'Access-Control-Allow-Origin': '*', // Môžeš zmeniť na svoju doménu
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Netlify potrebuje špeciálnu odpoveď na OPTIONS požiadavku
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  // Kontrola, či ide o POST metódu
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("SERVER ERROR: GEMINI_API_KEY nie je nastavený!");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API kľúč nie je nakonfigurovaný.' })
      };
    }

    // V Netlify je telo požiadavky v event.body ako string
    const { transcript, language } = JSON.parse(event.body);

    if (!transcript) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Chýba prepis (transcript).' })
      };
    }

    // Zavoláme tvoju existujúcu funkciu z gemini.js
    const commandData = await processTranscriptWithGemini(transcript, language, apiKey);

    // Vrátime úspešnú odpoveď v Netlify formáte
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(commandData)
    };

  } catch (error) {
    console.error('SERVER ERROR:', error);
    // Vrátime chybovú odpoveď v Netlify formáte
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Nastala chyba pri spracovaní príkazu.' })
    };
  }
};