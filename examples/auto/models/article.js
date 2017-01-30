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

module.exports = function(app){
  //create the model on the subapp using the db for this subapp
  app.locals.Article = app.db.model('Article',ArticleSchema);
};