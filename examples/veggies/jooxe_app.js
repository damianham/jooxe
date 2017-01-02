/*
 * example app to render a page with a list of veggies using the express-hbs template engine
 * and mounted on /veggies
 */

const express = require('express'),
  favicon = require('serve-favicon'),
  fs = require('fs'),
  path = require('path'),
  hbs = require('express-hbs');   //  https://github.com/barc/express-hbs

module.exports.init = function(callback) {
  const app = express();

  // Initialize favicon middleware
  if (fs.exists('public/img/brand/favicon.ico')) {
    app.use(favicon('public/img/brand/favicon.ico'));
  }

  app.engine('html', hbs.express4({
    extname: '.html',
    layoutsDir: path.join(__dirname, 'views'),
    defaultLayout: path.join(__dirname, 'views', 'layout.html'),
    partialsDir: path.join(__dirname, 'views', 'partials')
  }));
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, 'views'));

  app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));

  app.get('/', function (req, res) {
    res.render('index', {
      title: 'Hey',
      message: 'Hello there!',
      description: 'this is the veggies website',
      cssFiles: ['/css/styls.css', '/css/veggies.css'],
      veggies: [
    { name: 'asparagus' },
    { name: 'carrot' },
    { name: 'spinach' }
      ] });
  });

  callback(app, { mount_point: '/veggies' });
};
