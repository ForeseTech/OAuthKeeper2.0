// @desc       Get all contacts
// @route      GET /contacts
// @access     Private
const getContacts = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show all contacts` });
};

// @desc       Create new contact
// @route      POST /contacts
// @access     Private
const createContact = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Create new contact` });
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
