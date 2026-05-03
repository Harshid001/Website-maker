const Chat = require('../models/Chat');
const SavedOutput = require('../models/SavedOutput');
const llmService = require('../services/llmService');
const ragService = require('../services/ragService');

const VALID_MODEL_PROVIDERS = ['openai', 'gemini', 'claude', 'local'];
const VALID_CATEGORIES = [
  'Website Builder',
  '2D Design',
  'Animation',
  '3D Design',
  'Business Strategy',
  'Marketing Content',
  'Project Planning',
  'UI/UX Improvement',
  'Code Help',
  'General Chat',
];

const cleanString = (value, maxLength = 1000) => {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>]/g, '').replace(/\s+\n/g, '\n').trim().slice(0, maxLength);
};

const getRequestUserId = (req) => {
  return req.user?._id?.toString() || cleanString(req.body?.userId || req.query?.userId || 'demo-user-id', 120);
};

const cleanProjectContext = (projectContext = {}) => ({
  projectName: cleanString(projectContext.projectName, 160),
  businessType: cleanString(projectContext.businessType, 160),
  targetAudience: cleanString(projectContext.targetAudience, 220),
  designStyle: cleanString(projectContext.designStyle, 220),
  goal: cleanString(projectContext.goal, 300),
});

const sendJsonError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const sendMessage = async (req, res) => {
  const userId = getRequestUserId(req);
  const projectId = cleanString(req.body.projectId || 'dashboard-ai-project', 120);
  const rawMessage = typeof req.body.message === 'string' ? req.body.message : '';
  const message = cleanString(rawMessage, 4000);
  const modelProvider = cleanString(req.body.modelProvider || 'openai', 40).toLowerCase();
  const category = cleanString(req.body.category || 'General Chat', 80);
  const projectContext = cleanProjectContext(req.body.projectContext);

  if (!message) {
    return sendJsonError(res, 400, 'Message is required.');
  }

  if (rawMessage.length > 4000) {
    return sendJsonError(res, 400, 'Message is too long. Please keep it under 4000 characters.');
  }

  if (!VALID_MODEL_PROVIDERS.includes(modelProvider)) {
    return sendJsonError(res, 400, 'Invalid model provider selected.');
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return sendJsonError(res, 400, 'Invalid chat category selected.');
  }

  try {
    let chat = await Chat.findOne({ userId, projectId });
    if (!chat) {
      chat = new Chat({ userId, projectId, messages: [] });
    }

    const previousMessages = chat.messages.slice(-12).map((entry) => ({
      role: entry.role,
      content: entry.content,
    }));

    chat.projectContext = projectContext;
    chat.messages.push({
      role: 'user',
      content: message,
      modelProvider,
      category,
      createdAt: new Date(),
    });
    await chat.save();

    const relevantKnowledge = await ragService.getRelevantProjectKnowledge(projectId, message);
    const reply = await llmService.generateReply({
      modelProvider,
      category,
      projectContext,
      message,
      history: previousMessages,
      relevantKnowledge,
    });

    chat.messages.push({
      role: 'assistant',
      content: reply,
      modelProvider,
      category,
      createdAt: new Date(),
    });
    await chat.save();

    return res.status(200).json({
      success: true,
      reply,
      modelProvider,
      category,
      chatId: chat._id,
    });
  } catch (error) {
    console.error('Chat send error:', error.response?.data || error.message);
    return sendJsonError(
      res,
      error.statusCode || 500,
      error.statusCode
        ? error.message
        : 'Something went wrong while generating AI response.'
    );
  }
};

const getChatHistory = async (req, res) => {
  const projectId = cleanString(req.params.projectId, 120);
  const userId = getRequestUserId(req);

  try {
    const chat = await Chat.findOne({ userId, projectId }).lean();

    return res.status(200).json({
      success: true,
      messages: chat?.messages || [],
      projectContext: chat?.projectContext || {},
    });
  } catch (error) {
    console.error('Chat history error:', error.message);
    return sendJsonError(res, 500, 'Could not fetch chat history.');
  }
};

const clearChat = async (req, res) => {
  const projectId = cleanString(req.params.projectId, 120);
  const userId = getRequestUserId(req);

  try {
    await Chat.findOneAndUpdate(
      { userId, projectId },
      { $set: { messages: [] } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Chat history cleared.',
    });
  } catch (error) {
    console.error('Clear chat error:', error.message);
    return sendJsonError(res, 500, 'Could not clear chat history.');
  }
};

const saveOutput = async (req, res) => {
  const userId = getRequestUserId(req);
  const projectId = cleanString(req.body.projectId || 'dashboard-ai-project', 120);
  const title = cleanString(req.body.title || 'Saved AI Output', 160);
  const content = cleanString(req.body.content, 20000);
  const category = cleanString(req.body.category || 'General Chat', 80);
  const type = cleanString(req.body.type || 'ai-output', 80);

  if (!content) {
    return sendJsonError(res, 400, 'Saved output content is required.');
  }

  try {
    const savedOutput = await SavedOutput.create({
      userId,
      projectId,
      title,
      content,
      category,
      type,
    });

    return res.status(201).json({
      success: true,
      savedOutput,
    });
  } catch (error) {
    console.error('Save output error:', error.message);
    return sendJsonError(res, 500, 'Could not save AI output.');
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  clearChat,
  saveOutput,
};
