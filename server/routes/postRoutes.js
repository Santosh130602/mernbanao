const express = require('express');
const { addPost, getMyPost, getAllPosts, updatePost, deletePost, addLikeToPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/addPost').post(protect, addPost);
router.route('/myposts').get(protect, getMyPost);
router.route('/posts').get(protect, getAllPosts);
router.route('/updatepost/:id').put(protect, updatePost);
router.route('/addlike/:id').put(protect, addLikeToPost);
router.route('/deletepost/:id').delete(protect, deletePost);

module.exports = router;