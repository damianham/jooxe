'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Article title',
    trim: true
  },
  content: {
    type: String,
    default: '',
    required: 'Please fill Article content',
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

mongoose.model('IonicArticle', ArticleSchema);
