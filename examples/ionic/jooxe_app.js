/*
 * example app to render an ionic based app and mounted on /ionic
 */

const config = require('./config'),
  express = require('express'),
  favicon = require('serve-favicon'),
  fs = require('fs'),
  path = require('path'),
  articles = require(path.join(__dirname,'/api/articles/articles.server.routes')),
  chats = require(path.join(__dirname,'/api/chats/chats.server.routes')),
  bootstrap = require('./bootstrap');

  // create more api endpoints in a similar way to articles e.g.
  // users = require(path.join(__dirname,'/api/users/users.server.routes'));

module.exports.init = function(db_pool, callback) {
  const app = express();

  // Initialize favicon middleware
  if (fs.exists('public/img/brand/favicon.ico')) {
    app.use(favicon('public/img/brand/favicon.ico'));
  }

  // serve static files from the jooxe/apps/ionic/www folder
  app.use('/', express.static(path.join(__dirname, 'www'), { maxAge: 86400000 }));

  // use the db from the shared connection pool for the sub app
  // so the models are distinct to each database
  app.db = db_pool.useDb(config.db.name);
  
  articles(app);
  chats(app);
  
  // add more api endpoints here, e.g.
  // users(app)
  
  // bootstrap the app - connect to the mongo database and add test data
  bootstrap(app);
  
  // mount this sub app on /ionic
  callback(app, { mount_point: '/ionic' });
};
