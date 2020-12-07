const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');

const errorHandler = require('./middleware/error');

// Route Files
const contactsRouter = require('./routes/contacts');
const connectDB = require('./config/db');

// Connect to DB
connectDB();

// Instantiate express app
const app = express();

// Error handling middleware
app.use(errorHandler);

// Body-parser middleware
app.use(express.json());

// Mount routers
app.use('/contacts', contactsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV.underline} mode on port ${PORT}.`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
