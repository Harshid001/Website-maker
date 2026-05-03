const axios = require('axios');

const mapMessagesForClaude = (messages) => {
  const system = messages.find((message) => message.role === 'system')?.content || '';
  const conversation = messages
    .filter((message) => message.role !== 'system')
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content,
    }));

  return { system, conversation };
};

const generateClaudeReply = async (messages) => {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    const error = new Error('Claude API key is not configured on the server.');
    error.statusCode = 503;
    throw error;
  }

  const { system, conversation } = mapMessagesForClaude(messages);
  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-latest',
      max_tokens: 1200,
      temperature: 0.7,
      system,
      messages: conversation,
    },
    {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      timeout: 45000,
    }
  );

  return response.data?.content
    ?.map((part) => part.text)
    .filter(Boolean)
    .join('\n')
    .trim();
};

module.exports = { generateClaudeReply };
