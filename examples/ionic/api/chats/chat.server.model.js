'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Chat Schema
 */
module.exports = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Chat title',
    trim: true
  },
  lastText: {
    type: String,
    default: '',
    required: 'last message Text required',
    trim: true
  },
  face: {
    type: String,
    default: '',
    required: 'Last message poster image required',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});
 
