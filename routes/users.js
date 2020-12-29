const express = require('express');
const {
  renderRegister,
  registerUser,
  renderLogin,
  loginUser,
  confirmEmail,
  renderForgotPasswordForm,
  forgotPassword,
  renderUpdatePasswordForm,
  updatePassword,
  renderResetPasswordForm,
  resetPassword,
  logout,
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/register').get(renderRegister).post(registerUser);

router.route('/login').get(renderLogin).post(loginUser);

router.route('/confirmemail').get(confirmEmail);

router.route('/forgotpassword').get(renderForgotPasswordForm).post(forgotPassword);

router.route('/updatepassword').get(protect, renderUpdatePasswordForm).put(protect, updatePassword);

router.route('/resetpassword/:resettoken').get(renderResetPasswordForm).put(resetPassword);

router.route('/logout').get(logout);

module.exports = router;
