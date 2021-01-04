const mongoose = require('mongoose');
const colors = require('colors');

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then((conn) => {
        console.log(`MongoDB Connected : ${conn.connection.host}`.cyan.underline);
      })
      .catch((err) => {
        console.log('Database connection error : ' + err);
      });
  }
}

module.exports = new Database();
