const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for developer
  console.log(err.stack.red);

  // Mongoose Bad ObjectID
  if (err.name === 'CastError') {
    const message = `Resource not found.`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Duplicate Key - Is triggered when we try to insert a contact with a duplicate phone
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Validation Error - Is triggered when a required field in the model is not passed in req.body
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).render('error.ejs', { err });
};

module.exports = errorHandler;
