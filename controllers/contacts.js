const Contact = require('../models/Contact');

// @desc       Get all contacts
// @route      GET /contacts
// @access     Private
const getContacts = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show all contacts` });
};

// @desc       Create new contact
// @route      POST /contacts
// @access     Private
const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc       Update contact
// @route      PUT /contacts/:id
// @access     Private
const updateContact = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Update contact ${req.params.id}` });
};

// @desc       Delete contact
// @route      DELETE /contacts/:id
// @access     Private
const deleteContact = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete contact ${req.params.id}` });
};

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
};
