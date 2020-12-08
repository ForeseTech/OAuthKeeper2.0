const express = require('express');
const { createContact, getContacts, updateContact, deleteContact } = require('../controllers/contacts');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getContacts).post(protect, authorize('Member', 'Admin'), createContact);

router
  .route('/:id')
  .put(protect, authorize('Member', 'Admin'), updateContact)
  .delete(protect, authorize('Member', 'Admin'), deleteContact);

module.exports = router;
