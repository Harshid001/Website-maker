const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Template API placeholder. Frontend template data remains local for now.',
    templates: [],
  });
});

module.exports = router;
