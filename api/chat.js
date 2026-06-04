const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-2.5-flash';

function extractOutputText(data) {
  return (data.candidates || [])
    .flatMap((candidate) => candidate.content?.parts || [])
    .map((part) => part.text || '')
    .join('\n')
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is missing. Add it in Vercel Environment Variables.',
    });
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const contents = messages
    .filter((message) => message?.content && ['user', 'assistant'].includes(message.role))
    .slice(-12)
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(message.content).slice(0, 4000) }],
    }));

  if (!contents.length) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const geminiResponse = await fetch(`${GEMINI_API_URL}/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: 'You are MSP AI, a helpful web assistant for students. Answer clearly in the language of the user. If the user asks for tables, format them in readable Markdown. Be practical, concise, and friendly.',
            },
          ],
        },
        contents,
        generationConfig: {
          maxOutputTokens: 900,
        },
      }),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(geminiResponse.status).json({
        error: data.error?.message || 'Gemini API request failed.',
      });
    }

    const answer = extractOutputText(data);
    return res.status(200).json({
      answer: answer || 'The answer is empty. Try rephrasing your question.',
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Server error.',
    });
  }
}
