if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const colors = require('colors');

const app = require('./app');
const connectDB = require('./config/db');

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
