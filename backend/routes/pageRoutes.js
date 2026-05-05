const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getPages,
  getPageById,
  addPage,
  updatePage,
  deletePage,
} = require('../controllers/pageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getPages)
  .post(protect, addPage);

router.route('/:pageId')
  .get(protect, getPageById)
  .put(protect, updatePage)
  .delete(protect, deletePage);

module.exports = router;
