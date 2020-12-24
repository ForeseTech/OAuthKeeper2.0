const fs = require('fs');
const crypto = require('crypto');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const { format } = require('date-fns');

// @desc       Render Form For User Registration
// @route      GET /users/register
// @access     Public
const renderRegister = (req, res, next) => {
  res.status(200).render('users/register');
};

// @desc       Register User, Then Redirect To Dashboard
// @route      POST /users/register
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

  // Generate E-Mail Confirmation Token
  const confirmEmailToken = user.generateEmailConfirmToken();

  // Create Reset URL
  const confirmEmailURL = `${req.protocol}://${req.get('host')}/users/confirmemail?token=${confirmEmailToken}`;

  const message = `You are receiving this email because you need to confirm your email address. Click <a href="${confirmEmailURL}">here</a> to confirm your e-mail.`;

  user.save({ validateBeforeSave: false });

  await sendEmail({
    email,
    subject: 'OAuthKeeper - Confirm Your E-Mail ID',
    message,
  });

  req.flash('success', 'A confirmation mail has been sent to your E-Mail ID.');
  res.redirect('/users/login');

  // Send token response
  // sendTokenResponse(user, 200, req, res, `Welcome, ${user.name}`);
});

// @desc       Render Form For User Login
// @route      GET /users/login
// @access     Public
const renderLogin = (req, res, next) => {
  res.status(200).render('users/login');
};

// @desc       Log User In, Then Redirect To Dashboard
// @route      POST /users/login
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

  if (!user.isEmailConfirmed) {
    req.flash('error', 'Please confirm your E-Mail ID first.');
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
  sendTokenResponse(user, 200, req, res, `Welcome, ${user.name}`);
});

// @desc       Confirm Email
// @route      GET /users/confirmemail
// @access     Public
const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  const splitToken = token.split('.')[0];
  const confirmEmailToken = crypto.createHash('sha256').update(splitToken).digest('hex');

  // get user by token
  const user = await User.findOne({
    confirmEmailToken,
    isEmailConfirmed: false,
  });

  if (!user) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  // update confirmed to true
  user.confirmEmailToken = undefined;
  user.isEmailConfirmed = true;

  // save
  user.save({ validateBeforeSave: false });

  // return token
  sendTokenResponse(user, 200, req, res, 'Your E-Mail ID was successfully verified.');
});

// @desc       Render Form To Accept E-Mail From User Who Has Forgotten Password
// @route      GET /users/forgotpassword
// @access     Public
const renderForgotPasswordForm = (req, res, next) => {
  res.status(200).render('users/forgotpassword');
};

// @desc       Send link to reset password to user e-mail
// @route      POST /users/forgotpassword
// @access     Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    req.flash('error', 'No such user exists');
    return res.redirect('/users/forgotpassword');
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Reset URL
  const resetURL = `${req.protocol}://${req.get('host')}/users/resetpassword/${resetToken}`;

  const message = `You are receiving this message because you (or someone else) has requested the reset of your password. Please click <a href=${resetURL}>here</a> to reset your password.`;

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
    return res.redirect('/users/forgotpassword');
  }
});

// @desc       Render Form To Update Password for Logged in User
// @route      GET /users/updatepassword
// @access     Private
const renderUpdatePasswordForm = (req, res, next) => {
  res.status(200).render('users/updatepassword');
};

// @desc       Update Password in DB
// @route      PUT /users/updatepassword
// @access     Private
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    req.flash('error', 'Incorrect password entered.');
    return res.redirect('/users/updatepassword');
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, req, res, 'Updated Password Successfully');
});

// @desc       Render Form to Reset Password
// @route      GET /resetpassword/:resettoken
// @access     Public
const renderResetPasswordForm = (req, res, next) => {
  // Get Reset Token
  const resetToken = req.params.resettoken;

  res.status(200).render('users/resetpassword', { resetToken });
};

// @desc       Reset Password, then log them in
// @route      PUT /resetpassword/:resettoken
// @access     Public
const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

  const user = await User.findOne({ resetPasswordToken, resetPasswordExpiration: { $gt: Date.now() } });

  if (!user) {
    req.flash('error', 'Invalid Token');
    return res.redirect('users/resetpassword');
  }

  // Set the new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpiration = undefined;

  await user.save();

  sendTokenResponse(user, 200, req, res, 'Password reset successful.');
});

// @desc       Log User Out / Clear Cookie
// @route      GET /users/logout
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
// @route      GET /users/me
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

  req.flash('success', flashMsg);
  res.cookie('token', token, options).redirect('/contacts');
};

module.exports = {
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
  getMe,
};
