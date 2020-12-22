const fs = require('fs');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const { format } = require('date-fns');

// @desc       Render Form For User Registration
// @route      GET /register
// @access     Public
const renderRegister = (req, res, next) => {
  res.status(200).render('users/register');
};

// @desc       Register User, Then Redirect To Dashboard
// @route      POST /register
// @access     Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password, password2 } = req.body;

  User.findOne({ email: email }).then((user) => {
    if (user) {
      req.flash('error', 'A user with the E-Mail ID already exists.');
      return res.redirect('/users/register');
    }
  });

  if (password.length < 6) {
    req.flash('error', 'Password length must be atleast 6 characters.');
    return res.redirect('/users/register');
  }

  if (password !== password2) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect('/users/register');
  }

  const user = await User.create(req.body);

  // Send token response
  sendTokenResponse(user, 200, req, res, `Welcome ${user.name}`);
});

// @desc       Render Form For User Login
// @route      GET /login
// @access     Public
const renderLogin = (req, res, next) => {
  res.status(200).render('users/login');
};

// @desc       Log User In, Then Redirect To Dashboard
// @route      POST /login
// @access     Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input email and password
  // We need to validate as login info is not validated against the Model
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  // Check if user exists
  if (!user) {
    req.flash('error', 'No such user exists. Please register first.');
    return res.redirect('/users/login');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    req.flash('error', 'Invalid Login Credentials.');
    return res.redirect('/users/login');
  }

  const formatDate = format(Date.now(), 'd MMMM yyyy h:m:s b');
  let data = `${formatDate} ${user.name} logged in.\n`;
  fs.appendFile('utils/logs/OAuthKeeperLogs.txt', data, (err) => {
    if (err) throw err;
  });

  // Send token response
  sendTokenResponse(user, 200, req, res, `Welcome ${user.name}`);
});

const renderForgotPasswordForm = (req, res, next) => {
  res.status(200).render('users/forgotPassword');
};

const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    req.flash('error', 'There is no user with that email');
    return res.redirect('/users/forgotpassword');
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Reset URL
  const resetURL = `${req.protocol}://${req.get('host')}/users/resetpassword/${resetToken}`;

  const message = `You are receiving this message because you (or someone else) has requested the reset of a forgotPassword. Please click on the following link to reset your password\n\n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'OAuthKeeper - Password Reset Link',
      message,
    });

    req.flash('success', 'A password reset link has been sent to your E-Mail ID.');
    res.redirect('/users/forgotpassword');
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    req.flash('error', 'Email could not be sent. Please contact administrator.');
    return res.redirect('/users/forgotPassword');
  }
});

const renderUpdatePasswordForm = (req, res, next) => {
  res.status(200).render('users/updatePassword');
};

const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    req.flash('error', 'Incorrect password entered.');
    return res.redirect('/users/updatePassword');
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, req, res, 'Updated Password Successfully');
});

// @desc       Log User Out / Clear Cookie
// @route      GET /logout
// @access     Private
const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  req.flash('success', 'You have logged out');
  res.redirect('/users/login');
});

// @desc       Get currently logged in user
// @route      GET /me
// @access     Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, req, res, flashMsg) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  req.flash('success', flashMsg);
  res.cookie('token', token, options).redirect('/contacts');
};

module.exports = {
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
};
