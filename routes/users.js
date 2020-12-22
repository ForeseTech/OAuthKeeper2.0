const express = require('express');
const {
  renderRegister,
  registerUser,
  renderLogin,
  loginUser,
  renderForgotPasswordForm,
  forgotPassword,
  renderUpdatePasswordForm,
  updatePassword,
  logout,
  getMe,
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/register').get(renderRegister).post(registerUser);

router.route('/login').get(renderLogin).post(loginUser);

router.route('/forgotpassword').get(renderForgotPasswordForm).post(forgotPassword);

router.route('/updatepassword').get(protect, renderUpdatePasswordForm).post(protect, updatePassword);

router.route('/me').get(protect, getMe);

router.route('/logout').get(logout);

module.exports = router;
