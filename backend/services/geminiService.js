const axios = require('axios');

const mapMessagesForGemini = (messages) => {
  const systemMessage = messages.find((message) => message.role === 'system')?.content || '';
  const conversation = messages
    .filter((message) => message.role !== 'system')
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

  return {
    systemInstruction: {
      parts: [{ text: systemMessage }],
    },
    contents: conversation,
  };
};

const generateGeminiReply = async (messages) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error('Gemini API key is not configured on the server.');
    error.statusCode = 503;
    throw error;
  }

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      ...mapMessagesForGemini(messages),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1200,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 45000,
    }
  );

  return response.data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join('\n')
    .trim();
};

module.exports = { generateGeminiReply };
