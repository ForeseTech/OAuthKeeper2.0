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
  res.status(200).json({ success: true });
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
  res.status(200).json({ success: true });
});

module.exports = {
  renderRegister,
  registerUser,
  renderLogin,
  loginUser,
};
