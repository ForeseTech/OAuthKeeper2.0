const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
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
app.set('views', path.join(__dirname, 'views/'));

// Body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Method-override middleware
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Serve static assets
app.use(express.static(path.join(__dirname, '/public')));

// express-session middleware
const sessionConfig = {
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  // store: new MongoStore({ mongooseConnection: mongoose.connection }),
};
app.use(session(sessionConfig));

// connect-flash middleware
app.use(flash());

// flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

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

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV.underline} mode on port ${PORT}.`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
