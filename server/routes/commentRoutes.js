const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addComment, getAllComments } = require('../controllers/commentController');

const router = express.Router();

router.route('/addcomment').post(protect, addComment);
router.route('/:id/getallcomments').get(getAllComments);

module.exports = router;