const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-4.1-mini';

function extractOutputText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join('\n').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY is missing. Add it in Vercel Environment Variables.',
    });
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const cleanedMessages = messages
    .filter((message) => message?.content && ['user', 'assistant'].includes(message.role))
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: String(message.content).slice(0, 4000),
    }));

  if (!cleanedMessages.length) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
        instructions:
          'You are MSP AI, a helpful web assistant for students. Answer clearly in the language of the user. If the user asks for tables, format them in readable Markdown. Be practical, concise, and friendly.',
        input: cleanedMessages,
        max_output_tokens: 900,
      }),
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return res.status(openaiResponse.status).json({
        error: data.error?.message || 'OpenAI API request failed.',
      });
    }

    const answer = extractOutputText(data);
    return res.status(200).json({
      answer: answer || 'Ответ пустой. Попробуй переформулировать вопрос.',
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Server error.',
    });
  }
}
