const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');

// Route Files
const contactsRouter = require('./routes/contacts');

const app = express();

// Mount routers
app.use('/contacts', contactsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV.underline} mode on port ${PORT}.`.yellow.bold);
});
