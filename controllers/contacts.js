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
// @route      GET /contacts/:page
// @access     Private
const renderDashboard = asyncHandler(async (req, res, next) => {
  let perPage = 100;
  let page = req.params.page || 1;

  // If user is member, show only their contacts
  if (req.user.role === 'Member') {
    contacts = await Contact.find({ user: req.user.id })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: 'user',
        select: 'name incharge',
      })
      .sort('-createdAt');

    count = await Contact.countDocuments({ user: req.user.id });
  } else if (req.user.role === 'Executive Director') {
    const members = await User.find({ incharge: req.user.name }, '_id');

    contacts = await Contact.find()
      .where('user')
      .in(members)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: 'user',
        select: 'name',
      })
      .sort('-createdAt');

    count = await Contact.countDocuments().where('user').in(members);
  }

  // Show all contacts if user is an Admin
  else if (req.user.role == 'Admin') {
    contacts = await Contact.find({}) // Get all documents
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: 'user',
        select: 'name incharge',
      })
      .sort('-createdAt');

    count = await Contact.countDocuments();
  }
  res.render('contacts/dashboard.ejs', {
    contacts,
    name: req.user.name,
    role: req.user.role,
    current: page,
    pages: Math.ceil(count / perPage),
  });
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
  let noOfMembers, statusCount, noOfContacts;
  let numOfMembers = {},
    countOfStatus = {},
    numOfContacts = {},
    sumOfContacts;

  if (req.user.role === 'Member') {
    modes = await Contact.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$mode',
          count: { $sum: '$count' },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    statuses = await User.aggregate([
      {
        $match: { _id: { $in: [req.user._id] } },
      },
      {
        $lookup: {
          from: 'contacts',
          let: {
            user: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$user', '$user'],
                },
              },
            },
            {
              $group: {
                _id: '$status',
                count: {
                  $sum: '$count',
                },
              },
            },
            {
              $project: {
                _id: 0,
                k: '$_id',
                v: '$count',
              },
            },
          ],
          as: 'statuses',
        },
      },
      {
        $addFields: {
          statuses: {
            $arrayToObject: '$statuses',
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          incharge: 1,
          statuses: 1,
        },
      },
      {
        $sort: { incharge: 1, name: 1 },
      },
    ]);

    sumOfContacts = await Contact.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          count: { $sum: '$count' },
        },
      },
    ]);
  } else if (req.user.role === 'Executive Director') {
    // Get the ID's of the members whose ED incharge is the logged in user
    const members = await User.find({ incharge: req.user.name }, '_id');
    memberIds = members.map((member) => member._id);

    modes = await Contact.aggregate([
      { $match: { user: { $in: memberIds } } },
      {
        $group: {
          _id: '$mode',
          count: { $sum: '$count' },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    statuses = await User.aggregate([
      {
        $match: { _id: { $in: memberIds } },
      },
      {
        $lookup: {
          from: 'contacts',
          let: {
            user: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$user', '$user'],
                },
              },
            },
            {
              $group: {
                _id: '$status',
                count: {
                  $sum: '$count',
                },
              },
            },
            {
              $project: {
                _id: 0,
                k: '$_id',
                v: '$count',
              },
            },
          ],
          as: 'statuses',
        },
      },
      {
        $addFields: {
          statuses: {
            $arrayToObject: '$statuses',
          },
        },
      },
      {
        $project: {
          name: 1,
          incharge: 1,
          statuses: 1,
        },
      },
      {
        $sort: { incharge: 1, name: 1 },
      },
    ]);

    noOfMembers = await User.aggregate([
      { $match: { incharge: req.user.name } },
      {
        $group: {
          _id: '$incharge',
          count: { $sum: 1 },
        },
      },
    ]);

    for (let i = 0; i < noOfMembers.length; i++) {
      numOfMembers[noOfMembers[i]._id] = noOfMembers[i].count;
    }

    statusCount = await Contact.aggregate([
      { $match: { user: { $in: memberIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: '$count' },
        },
      },
    ]);

    for (let i = 0; i < statusCount.length; i++) {
      countOfStatus[statusCount[i]._id] = statusCount[i].count;
    }

    noOfContacts = await Contact.aggregate([
      { $match: { user: { $in: memberIds } } },
      {
        $group: {
          _id: '$user',
          count: {
            $sum: '$count',
          },
        },
      },
    ]);

    for (let i = 0; i < noOfContacts.length; i++) {
      numOfContacts[noOfContacts[i]._id] = noOfContacts[i].count;
    }

    sumOfContacts = await Contact.aggregate([
      { $match: { user: { $in: memberIds } } },
      {
        $group: {
          _id: null,
          count: { $sum: '$count' },
        },
      },
    ]);
  } else if (req.user.role == 'Admin') {
    modes = await Contact.aggregate([
      {
        $group: {
          _id: '$mode',
          count: { $sum: '$count' },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    statuses = await User.aggregate([
      {
        $match: { role: 'Member' },
      },
      {
        $lookup: {
          from: 'contacts',
          let: {
            user: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$user', '$user'],
                },
              },
            },
            {
              $group: {
                _id: '$status',
                count: {
                  $sum: '$count',
                },
              },
            },
            {
              $project: {
                _id: 0,
                k: '$_id',
                v: '$count',
              },
            },
          ],
          as: 'statuses',
        },
      },
      {
        $addFields: {
          statuses: {
            $arrayToObject: '$statuses',
          },
        },
      },
      {
        $project: {
          name: 1,
          incharge: 1,
          statuses: 1,
        },
      },
      {
        $sort: { incharge: 1, name: 1 },
      },
    ]);

    noOfMembers = await User.aggregate([
      { $match: { incharge: { $in: ['Adhihariharan', 'Anuja', 'Dhivya', 'Govind', 'Joann'] } } },
      {
        $group: {
          _id: '$incharge',
          count: { $sum: 1 },
        },
      },
    ]);

    for (let i = 0; i < noOfMembers.length; i++) {
      numOfMembers[noOfMembers[i]._id] = noOfMembers[i].count;
    }

    statusCount = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: '$count' },
        },
      },
    ]);

    for (let i = 0; i < statusCount.length; i++) {
      countOfStatus[statusCount[i]._id] = statusCount[i].count;
    }

    noOfContacts = await Contact.aggregate([
      {
        $group: {
          _id: '$user',
          count: {
            $sum: '$count',
          },
        },
      },
    ]);

    for (let i = 0; i < noOfContacts.length; i++) {
      numOfContacts[noOfContacts[i]._id] = noOfContacts[i].count;
    }

    sumOfContacts = await Contact.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: '$count' },
        },
      },
    ]);
  }

  res.render('contacts/statistics.ejs', {
    modes,
    statuses,
    numOfMembers,
    countOfStatus,
    numOfContacts,
    sumOfContacts,
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
  req.body.phone = req.body.phone.replace(/ /g, '');

  Contact.findOne({ phone: req.body.phone }).then((contact) => {
    if (contact) {
      req.flash('error', 'Cannot create contact as this phone number already exists in the DB.');
      return res.redirect('/contacts/1');
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
  res.redirect('/contacts/1');
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
  res.redirect('/contacts/1');
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
  res.redirect('/contacts/1');
});

module.exports = {
  renderDashboard,
  renderTable,
  renderStatistics,
  createContact,
  updateContact,
  deleteContact,
};
