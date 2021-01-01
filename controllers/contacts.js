// TODO : Check out YelpCamp's way of accepting form data using arrays
const Contact = require('../models/Contact');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const getContacts = async (req, res, view) => {
  let contacts;

  // If user is member, show only their contacts
  if (req.user.role === 'Member') {
    contacts = await Contact.find({ user: req.user.id }).sort('-createdAt');
  }

  // Show contacts of all team members if user is an ED
  else if (req.user.role === 'Executive Director') {
    // Get the ID's of the members whose ED incharge is the logged in user
    const members = await User.find({ incharge: req.user.name }, '_id');

    // Get contacts of the team members whose ED incharge is the logged in user
    contacts = await Contact.find()
      .where('user')
      .in(members)
      .populate({
        path: 'user',
        select: 'name',
      })
      .sort('-createdAt');
  }

  // Show all contacts if user is an Admin
  else if (req.user.role == 'Admin') {
    contacts = await Contact.find()
      .populate({
        path: 'user',
        select: 'name incharge',
      })
      .sort('-createdAt');
  }

  res.render(view, {
    name: req.user.name,
    role: req.user.role,
    contacts,
  });
};

// @desc       Display contacts according to the role of the user
// @route      GET /contacts
// @access     Private
const renderDashboard = asyncHandler(async (req, res, next) => {
  getContacts(req, res, 'contacts/dashboard.ejs');
});

// @desc       Display contacts according to the role of the user
// @route      GET /contacts/panel
// @access     Private
const renderTable = asyncHandler(async (req, res, next) => {
  getContacts(req, res, 'contacts/tabulation.ejs');
});

// @desc       Display stats for each user
// @route      GET /contacts/statistics
// @access     Private
const renderStatistics = asyncHandler(async (req, res, next) => {
  let statuses;

  if (req.user.role === 'Member') {
    statuses = await Contact.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: '$count' },
        },
      },
    ]);

    modes = await Contact.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$mode',
          count: { $sum: '$count' },
        },
      },
    ]);
  } else if (req.user.role === 'Executive Director') {
    // Get the ID's of the members whose ED incharge is the logged in user
    const members = await User.find({ incharge: req.user.name }, '_id');

    memberIds = members.map((member) => member._id);
    statuses = await Contact.aggregate([
      { $match: { user: { $in: memberIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: '$count' },
        },
      },
    ]);

    modes = await Contact.aggregate([
      { $match: { user: { $in: memberIds } } },
      {
        $group: {
          _id: '$mode',
          count: { $sum: '$count' },
        },
      },
    ]);
  } else if (req.user.role == 'Admin') {
    statuses = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: '$count' },
        },
      },
    ]);

    modes = await Contact.aggregate([
      {
        $group: {
          _id: '$mode',
          count: { $sum: '$count' },
        },
      },
    ]);
  }

  res.render('contacts/statistics.ejs', {
    statuses,
    modes,
    name: req.user.name,
    role: req.user.role,
  });
});

// @desc       Create new contact, then redirect
// @route      POST /contacts
// @access     Private
const createContact = asyncHandler(async (req, res, next) => {
  // Add user ID to request body
  req.body.user = req.user.id;

  Contact.findOne({ phone: req.body.phone }).then((contact) => {
    if (contact) {
      req.flash('error', 'Cannot create contact as this phone number already exists in the DB.');
      return res.redirect('/contacts');
    }
  });

  // Set address to empty string if contact wishes to use own transport
  if (req.body.ownTransport) {
    req.body.address = '';
    req.body.ownTransport = true;
  } else {
    req.body.ownTransport = false;
  }

  const contact = await Contact.create(req.body);

  req.flash('success', 'New Contact Successfully Added');
  res.redirect('/contacts');
});

// @desc       Update a contact, then redirect
// @route      PUT /contacts/:id
// @access     Private
const updateContact = asyncHandler(async (req, res, next) => {
  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact with the ID of ${req.params.id} does not exist.`, 404));
  }

  // Update contact only if contact belongs to the logged in user or if user is admin
  if (contact.user.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse(`User ${req.user.name} is not authorized to access this contact`, 401));
  }

  // Set address to empty string if contact wishes to use own transport
  if (req.body.ownTransport) {
    req.body.ownTransport = true;
    req.body.address = '';
  } else {
    req.body.ownTransport = false;
  }

  contact = await Contact.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });

  req.flash('success', 'Contact Successfully Updated');
  res.redirect('/contacts');
});

// @desc       Delete a contact, then redirect
// @route      DELETE /contacts/:id
// @access     Private
const deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`Contact with the ID of ${req.params.id} does not exist.`, 404));
  }

  // Delete contact only if contact belongs to the logged in user or if user is admin
  if (contact.user.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this contact`, 401));
  }

  contact.remove();

  req.flash('success', 'Contact Successfully Deleted');
  res.redirect('/contacts');
});

module.exports = {
  renderDashboard,
  renderTable,
  renderStatistics,
  createContact,
  updateContact,
  deleteContact,
};
