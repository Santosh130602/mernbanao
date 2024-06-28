const express = require('express');
const { registerUser, authUser, allUsers, forgotPassword } = require('../controllers/userController');

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.route('/forgotpassword').put(forgotPassword);
router.route('/').get(allUsers);

module.exports = router;