const express = require('express');
const { createContact, getContacts, updateContact, deleteContact } = require('../controllers/contacts');

const router = express.Router();

router.route('/').get(getContacts).post(createContact);

router.route('/:id').put(updateContact).delete(deleteContact);

module.exports = router;
