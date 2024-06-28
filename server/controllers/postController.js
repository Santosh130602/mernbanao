const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const Post = require('../models/postModel');

const addPost = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { post } = req.body;

    if (!post) {
        res.status(400);
        throw new Error('Please upload a Post.');
    }
    const createdPost = await Post.create({
        user: userId,
        post: post,
    });
    
    const populatedPost = await Post.findById(createdPost._id)
        .populate('user', '-password -email');

    res.status(201).json(populatedPost);
});

const getMyPost = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const posts = await Post.find({ user: userId }).populate('user', '-password -email').sort({ createdAt: -1 });

    res.status(200).json({ userId, posts });
});

const getAllPosts = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const posts = await Post.find().populate('user', '-password -email').sort({ createdAt: -1 });

    res.status(200).json({ userId, posts });
});

const updatePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const { post } = req.body;
    const userId = req.user._id;

    if (!postId) {
        res.status(400);
        throw new Error('Post ID is required.');
    }

    if (!post) {
        res.status(400);
        throw new Error('Please add a Post.');
    }

    let updatedPost = await Post.findById(postId);

    if (!updatedPost) {
        res.status(404);
        throw new Error('Post not found');
    }

    if (updatedPost.user.toString() !== userId.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this post');
    }

    updatedPost = await Post.updateOne({ _id: postId }, { $set: { post: post } });

    updatedPost = await Post.findById(postId).populate('user', '-password -email');

    res.status(200).json(updatedPost);
});

const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    if (!postId) {
        res.status(400);
        throw new Error('Post ID is required');
    }

    const post = await Post.findById(postId);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    if (post.user.toString() !== userId.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this post');
    }

    await Post.deleteOne({ _id: postId });

    res.status(200).json({ message: 'Post deleted successfully' });
});

const addLikeToPost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
        await Post.updateOne(
            { _id: postId },
            { $pull: { likes: userId } }
        );
        res.status(200).json({ message: 'Post unliked successfully' });
    } else {
        await Post.updateOne(
            { _id: postId },
            { $push: { likes: userId } }
        );
        res.status(200).json({ message: 'Post liked successfully' });
    }
});

module.exports = { addPost, getMyPost, getAllPosts, updatePost, deletePost, addLikeToPost }