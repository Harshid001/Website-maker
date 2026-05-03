const { buildMessages } = require('./promptService');
const { generateOpenAIReply } = require('./openaiService');
const { generateGeminiReply } = require('./geminiService');
const { generateClaudeReply } = require('./claudeService');
const { generateLocalModelReply } = require('./localModelService');

const providerMap = {
  openai: generateOpenAIReply,
  gemini: generateGeminiReply,
  claude: generateClaudeReply,
  local: generateLocalModelReply,
};

const generateReply = async ({
  modelProvider,
  category,
  projectContext,
  message,
  history,
  relevantKnowledge,
}) => {
  const provider = providerMap[modelProvider];

  if (!provider) {
    const error = new Error('Invalid model provider selected.');
    error.statusCode = 400;
    throw error;
  }

  const messages = buildMessages({
    category,
    projectContext,
    message,
    history,
    relevantKnowledge,
  });

  const reply = await provider(messages);

  if (!reply) {
    const error = new Error('The selected AI provider returned an empty response.');
    error.statusCode = 502;
    throw error;
  }

  return reply;
};

module.exports = { generateReply };
