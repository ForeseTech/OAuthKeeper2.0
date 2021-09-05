const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv').config();

// Load models
const Contact = require('./models/Contact');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/resources/_data/users.json`, 'utf-8')
);
const contacts = JSON.parse(
  fs.readFileSync(`${__dirname}/resources/_data/contacts.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Contact.create(contacts);

    console.log('Data Imported...'.green);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Contact.deleteMany();

    console.log('Data Destroyed...'.red);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
