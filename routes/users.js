const express = require('express');
const { renderRegister, registerUser, renderLogin, loginUser } = require('../controllers/users');

const router = express.Router();

router.route('/register').get(renderRegister).post(registerUser);

router.route('/login').get(renderLogin).post(loginUser);

module.exports = router;
