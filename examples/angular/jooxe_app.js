/*
 * example app to render an angular based app
 * and mounted on /angular
 */

const express = require('express'),
  favicon = require('serve-favicon'),
  fs = require('fs'),
  path = require('path'),
  articles = require(path.join(__dirname,'/api/articles/articles.server.routes'));

  // create more api endpoints in a similar way to articles and add them below e.g.
  // users = require(path.join(__dirname,'/api/users/users.server.routes'));

module.exports.init = function(callback) {
  const app = express();

  // Initialize favicon middleware
  if (fs.exists('public/img/brand/favicon.ico')) {
    app.use(favicon('public/img/brand/favicon.ico'));
  }

  app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));

  articles(app);
  
  // add more api endpoints here, e.g.
  // users(app)
  
  callback(app, { mount_point: '/angular' });
};
