const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc       Render Form For User Registration
// @route      GET /register
// @access     Public
const renderRegister = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});

// @desc       Register A User
// @route      POST /register
// @access     Public
const registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  // Send token response
  sendTokenResponse(user, 200, res);

  res.status(200).json({
    success: true,
    token,
  });
});

// @desc       Render Form For User Login
// @route      GET /login
// @access     Public
const renderLogin = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});

// @desc       Login A User
// @route      POST /login
// @access     Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input email and password
  // We need to validate as login info is not validated against the model
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  // Check if user exists
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Send token response
  sendTokenResponse(user, 200, res);

  res.status(200).json({
    success: true,
    token,
  });
});

// @desc       Log user out / Clear cookie
// @route      GET /logout
// @access     Private
const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
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
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

module.exports = {
  renderRegister,
  registerUser,
  renderLogin,
  loginUser,
  logout,
  getMe,
};
