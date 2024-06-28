const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const generateToken = require("../config/generateToken");
const bcrypt = require('bcryptjs');

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields.");
    }

    const userNameExist = await User.findOne({ username });
    const userEmailExist = await User.findOne({ email });

    if (userNameExist || userEmailExist) {
        res.status(400);
        throw new Error("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        username, email, password: hashedPassword
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error("User not found");
    }
});










const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400);
        throw new Error("Please enter all the fields.");
    }

    const user = await User.findOne({ username });


    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error("Invalid email or password");
    }
});


const forgotPassword = asyncHandler(async (req, res) => {
    const { email, updatedpassword } = req.body;

    if (!email || !updatedpassword) {
        res.status(400);
        throw new Error("Please enter all the fields.");
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(400);
        throw new Error("User not found.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(updatedpassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { password: hashedPassword },
        { new: true }
    );

    if (updatedUser) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    }
    else {
        res.status(400);
        throw new Error("Password update failed.");
    }
});

const allUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");

    res.status(201).send(users);
})

module.exports = { registerUser, authUser, allUsers, forgotPassword };