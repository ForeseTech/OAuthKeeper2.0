const express = require('express');
const {
  renderDashboard,
  renderTable,
  renderStatistics,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contacts');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').post(protect, authorize('Member', 'Admin'), createContact);
router.route('/panel').get(protect, renderTable);
router.route('/statistics').get(protect, renderStatistics);
router.route('/:page').get(protect, renderDashboard);

router
  .route('/:id')
  .put(protect, authorize('Member', 'Admin'), updateContact)
  .delete(protect, authorize('Member', 'Admin'), deleteContact);

module.exports = router;
