const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';

const proxyToAiService = async (path, payload = {}) => {
  try {
    const { data } = await axios.post(`${AI_SERVICE_URL}${path}`, payload, {
      timeout: Number(process.env.AI_PROXY_TIMEOUT_MS) || 15000,
    });
    return data;
  } catch (error) {
    return {
      ok: true,
      provider: 'node-placeholder',
      message: 'Python AI service is unavailable. Returning a safe placeholder response.',
      data: {
        path,
        payload,
        error: error.message,
      },
    };
  }
};

module.exports = {
  proxyToAiService,
};
