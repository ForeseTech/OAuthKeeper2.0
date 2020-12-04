const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: `Show all contacts` });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `Show contact ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.status(200).json({ success: true, msg: `Create new contact` });
});

router.put('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `Update contact ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `Delete contact ${req.params.id}` });
});

module.exports = router;
