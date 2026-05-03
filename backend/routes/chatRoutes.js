const express = require('express');
const {
  sendMessage,
  getChatHistory,
  clearChat,
  saveOutput,
} = require('../controllers/chatController');
const { createRateLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();
const chatRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 30 });

router.post('/send', chatRateLimiter, sendMessage);
router.get('/history/:projectId', chatRateLimiter, getChatHistory);
router.delete('/clear/:projectId', chatRateLimiter, clearChat);
router.post('/save-output', chatRateLimiter, saveOutput);

module.exports = router;
