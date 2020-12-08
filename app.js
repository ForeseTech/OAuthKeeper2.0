const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const colors = require('colors');
const ejsMate = require('ejs-mate');

const errorHandler = require('./middleware/error');

// Route Files
const contactsRouter = require('./routes/contacts');
const usersRouter = require('./routes/users');

const connectDB = require('./config/db');

// Connect to DB
connectDB();

// Instantiate express app
const app = express();

// Views and View Engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Cookie parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
  res.render('index');
});

// Mount routers
app.use('/contacts', contactsRouter);
app.use('/users', usersRouter);

// Error handling middleware
app.use(errorHandler);

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
