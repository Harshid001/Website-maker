const axios = require('axios');

const generateLocalModelReply = async (messages) => {
  const localModelUrl = process.env.LOCAL_MODEL_URL || 'http://localhost:11434/api/generate';
  const prompt = messages
    .map((message) => `${message.role.toUpperCase()}:\n${message.content}`)
    .join('\n\n');

  try {
    const response = await axios.post(
      localModelUrl,
      {
        model: process.env.LOCAL_MODEL_NAME || 'llama3.1',
        prompt,
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return (response.data?.response || response.data?.message?.content || '').trim();
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      const unavailable = new Error('Local model is not running. Please start your local AI server.');
      unavailable.statusCode = 503;
      throw unavailable;
    }

    throw error;
  }
};

module.exports = { generateLocalModelReply };
