'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Chat = mongoose.model('IonicChat'),
  errorHandler = require(path.join(__dirname, '../errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Chat
 */
exports.create = function(req, res) {
  var chat = new Chat(req.body);
  chat.user = req.user;

  chat.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chat);
    }
  });
};

/**
 * Show the current Chat
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var chat = req.chat ? req.chat.toJSON() : {};

  // Add a custom field to the Chat, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Chat model.
  chat.isCurrentUserOwner = req.user && chat.user && chat.user._id.toString() === req.user._id.toString();

  res.jsonp(chat);
};

/**
 * Update a Chat
 */
exports.update = function(req, res) {
  var chat = req.chat;

  chat = _.extend(chat, req.body);

  chat.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chat);
    }
  });
};

/**
 * Delete an Chat
 */
exports.delete = function(req, res) {
  var chat = req.chat;

  chat.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chat);
    }
  });
};

/**
 * List of Chats
 */
exports.list = function(req, res) { 
  Chat.find().sort('-created').populate('user').exec(function(err, chats) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else { 
      res.jsonp(chats || []);
    }
  });
};

/**
 * Chat middleware
 */
exports.chatByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Chat is invalid'
    });
  }

  Chat.findById(id).populate('user').exec(function (err, chat) {
    if (err) {
      return next(err);
    } else if (!chat) {
      return res.status(404).send({
        message: 'No Chat with that identifier has been found'
      });
    }
    req.chat = chat;
    next();
  });
};
