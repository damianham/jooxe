'use strict';

/**
 * Module dependencies.
 */

var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('AutoArticle');

/**
 * Article middleware
 */
var articleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No Article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};

exports.install = function(app) {
  console.log('installing article middleware');
  app.param('articleId', articleByID);
};
