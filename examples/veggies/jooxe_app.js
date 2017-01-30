/*
 * example app to render a page with a list of veggies using the express-hbs template engine
 * and mounted on /veggies
 */

const express = require('express'),
  favicon = require('serve-favicon'),
  fs = require('fs'),
  path = require('path'),
  hbs = require('express-hbs');   //  https://github.com/barc/express-hbs

module.exports.init = function(db_pool,callback) {
  const app = express();

  // Initialize favicon middleware
  if (fs.exists('public/img/brand/favicon.ico')) {
    app.use(favicon('public/img/brand/favicon.ico'));
  }

  // use the express-hbs handlebars templating engine to render views
  app.engine('html', hbs.express4({
    extname: '.html',
    layoutsDir: path.join(__dirname, 'views'),
    defaultLayout: path.join(__dirname, 'views', 'layout.html'),
    partialsDir: path.join(__dirname, 'views', 'partials')
  }));
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, 'views'));

  // serve static files from the jooxe/apps/veggies/public folder
  app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));

  // map the '/' route to display a list of veggies using jooxe/apps/veggies/views/index.html
  // which is rendered inside the layout of jooxe/apps/veggies/views/layout.html
  // this route maps to '/veggies/' or with a domainname http://veggies.example.com/
  app.get('/', function (req, res) {
    res.render('index', {
      livereload: true,
      title: 'Veggies rock',
      message: 'Hello there!',
      description: 'this is the veggies website',
      cssFiles: ['css/styls.css', 'css/veggies.css'],
      veggies: [
    { name: 'asparagus' },
    { name: 'carrot' },
    { name: 'spinach' }
      ] });
  });

  // mount this sub app on /veggies
  callback(app, { mount_point: '/veggies' });
};
