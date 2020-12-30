const express = require('express');
const {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
  getStatistics,
  getData,
} = require('../controllers/contacts');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getContacts).post(protect, authorize('Member', 'Admin'), createContact);
router.route('/panel').get(protect, getData);
router.route('/statistics').get(protect, getStatistics);

router
  .route('/:id')
  .put(protect, authorize('Member', 'Admin'), updateContact)
  .delete(protect, authorize('Member', 'Admin'), deleteContact);

module.exports = router;
