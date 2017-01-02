/*
 * An action that corresponds to the /users route
 */


/**
 * Module dependencies
 */
var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * User middleware to load the user identified by the userId
 */
module.exports.get = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findOne({
    _id: id
  }).exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load User ' + id));
    }

    req.user = user;
    next();
  });
};

module.exports.post = function (req, res, next) {

  var user = req.user;

  User.insertOne(user).exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to add User '));
    }

    req.user = user;
    next();
  });
};

