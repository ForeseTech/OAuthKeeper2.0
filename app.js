const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/contacts', (req, res) => {
  res.status(200).json({ success: true, msg: `Show all contacts` });
});

app.get('/contacts/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `Show contact ${req.params.id}` });
});

app.post('/contacts', (req, res) => {
  res.status(200).json({ success: true, msg: `Create new contact` });
});

app.put('/contacts/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `Update contact ${req.params.id}` });
});

app.delete('/contacts/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `Delete contact ${req.params.id}` });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV.underline} mode on port ${PORT}.`.yellow.bold);
});
