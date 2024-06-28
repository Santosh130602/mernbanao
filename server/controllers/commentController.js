const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const addComment = asyncHandler(async (req, res) => {
    const { postId, text } = req.body;
    const userId = req.user._id;

    if (!postId || !text) {
        res.status(400);
        throw new Error('Post ID and text are required');
    }

    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const comment = await Comment.create({
        user: userId,
        post: postId,
        text: text,
    });

    await Post.updateOne(
        { _id: postId },
        { $addToSet: { comments: comment._id } }
    );

    res.status(201).json(comment);
});

const getAllComments = asyncHandler(async (req, res) => {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const comments = await Comment.find({ post: postId }).populate('user', 'username');

    res.status(200).json(comments);
});

module.exports = { addComment, getAllComments }
