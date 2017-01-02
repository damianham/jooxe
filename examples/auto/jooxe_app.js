/*
 * example app to render a page based on views and actions
 */

const _ = require('lodash'),
  express = require('express'),
  favicon = require('serve-favicon'),
  fs = require('fs'),
  path = require('path'),
  hbs = require('express-hbs');   //  https://github.com/barc/express-hbs

const globber = require(path.join(process.cwd(), 'server/helpers/glob_paths'));

module.exports.init = function(callback) {
  const app = express();

  // Initialize favicon middleware
  if (fs.exists('public/img/brand/favicon.ico')) {
    app.use(favicon('public/img/brand/favicon.ico'));
  }

  app.engine('html', hbs.express4({
    extname: '.html',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: path.join(__dirname, 'views', 'layouts', 'layout.html'),
    partialsDir: path.join(__dirname, 'views', 'partials')
  }));
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, 'views'));

  app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));

  // create the mongoose schemas
  const models = globber(path.join(__dirname, 'models/**/*.js'));
  models.forEach(function(filepath) {
    require(filepath);
  });

  // install the middleware
  const middleware = globber(path.join(__dirname, 'middleware/**/*.js'));

  console.log('auto middleware ==', middleware);

  middleware.forEach(function(filepath) {
    var mod = require(filepath);
    mod.install(app);
  });

  // for each view - call the action and pass the result to the view
  var views = globber(path.join(__dirname, 'views/**/*.html'));

  var controllers = globber(path.join(__dirname, 'controllers/**/*.js'));

  // ignore layouts and partials
  _.remove(views, function(value, index, collection) {

    if (value.indexOf('views/layouts/') > -1) return true;
    if (value.indexOf('views/partials/') > -1) return true;
  });

  console.log('auto views ==', views);

  views.forEach(function(viewpath) {
    // remove leading directory and suffix
    var route = _.replace(viewpath, path.join(__dirname, 'views'), '');
    route = _.replace(route, '.html', '');
    console.log('route to ', route);
  });

  callback(app, { mount_point: '/auto' });
};
