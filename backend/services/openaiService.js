const axios = require('axios');

const generateOpenAIReply = async (messages) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const error = new Error('OpenAI API key is not configured on the server.');
    error.statusCode = 503;
    throw error;
  }

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1200,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 45000,
    }
  );

  return response.data?.choices?.[0]?.message?.content?.trim();
};

module.exports = { generateOpenAIReply };
