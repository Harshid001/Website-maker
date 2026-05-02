const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
// const { protect } = require('../middleware/authMiddleware'); // Uncomment if authentication is needed

router.post('/generate-content', aiController.generateWebsiteContent);
router.post('/generate-seo', aiController.generateSEO);
router.post('/suggest-template', aiController.suggestTemplate);
router.post('/suggest-animation', aiController.suggestAnimation);
router.post('/generate-design-text', aiController.generateDesignText);

module.exports = router;
