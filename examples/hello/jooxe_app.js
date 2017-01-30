/*
 * example app to renders a JSON object with the text 'hello world' mounted on /hello
 */

var express = require('express'),
  favicon = require('serve-favicon'),
  fs = require('fs'),
  path = require('path'),
  hbs = require('express-hbs');   //  https://github.com/barc/express-hbs

module.exports.init = function(db_pool,callback) {
  var app = express();

  // Initialize favicon middleware
  if (fs.exists('public/img/brand/favicon.ico')) {
    app.use(favicon('public/img/brand/favicon.ico'));
  }

  // serve static files from the jooxe/apps/hello/public folder
  app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));

  // a route in this subapp that maps to '/hello/world' or with a domainname http://hello.example.com/world
  app.use('/world', function(req, res) {
    res.json({ text: 'Hello world' });
  });

  // mount this sub app on /hello
  callback(app, { mount_point: '/hello' });
};
