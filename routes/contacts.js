const express = require('express');
const { createContact, getContacts, updateContact, deleteContact } = require('../controllers/contacts');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getContacts).post(protect, createContact);

router.route('/:id').put(protect, updateContact).delete(protect, deleteContact);

module.exports = router;
