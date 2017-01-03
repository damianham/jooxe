/*
 * example app to render a page with a list of veggies using the express-hbs template engine
 * and mounted on /veggies
 */

const express = require('express'),
  favicon = require('serve-favicon'),
  fs = require('fs'),
  path = require('path'),
  articles = require(path.join(__dirname,'/api/features/articles/articles.server.routes'));

module.exports.init = function(callback) {
  const app = express();

  // Initialize favicon middleware
  if (fs.exists('public/img/brand/favicon.ico')) {
    app.use(favicon('public/img/brand/favicon.ico'));
  }

  app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));

  articles(app);
  
  callback(app, { mount_point: '/angular' });
};
