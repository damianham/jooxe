/* 
 * example app that uses helmet and lusca to make the site more secure
 */



const config = require('./config'),
  express = require("express"),   // https://github.com/expressjs/express
  favicon = require('serve-favicon'), // https://github.com/expressjs/serve-favicon
  fs = require('fs'),
  path = require('path'),
  session = require('express-session'), 
  MongoStore = require('connect-mongo')(session), 
  lusca = require('lusca'),       // https://github.com/krakenjs/lusca
  helmet = require('helmet'),     // https://github.com/helmetjs/helmet
  hbs = require('express-hbs');   //  https://github.com/barc/express-hbs


/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords; 
  app.locals.livereload = config.livereload;
  app.locals.logo = config.logo;
  app.locals.favicon = config.favicon;
  app.locals.env = process.env.NODE_ENV;
  app.locals.domain = config.domain;

};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by'); 
  
};


/**
 * Configure Express session
 */
module.exports.initSession = function (app, db) {
  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl
    },
    name: config.sessionKey,
    store: new MongoStore({
      url: 'mongodb://localhost/jooxe-sessions' ,
      collection: config.sessionCollection
    })
  }));

  
};

module.exports.init = function(callback) {
  const app = express();
  
  // Initialize local variables
  this.initLocalVariables(app);
  
  // Add Lusca CSRF Middleware
  app.use(lusca(config.csrf));
  
  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize Express session
  this.initSession(app); 
  
  // Initialize favicon middleware
  if (fs.exists('public/img/brand/favicon.ico')) {
    app.use(favicon('public/img/brand/favicon.ico'));
  }   
  
  app.engine('html', hbs.express4({
    extname: '.html',
    layoutsDir: path.join(__dirname,'views'),
    defaultLayout: path.join(__dirname,'views','layout.html'),
    partialsDir: path.join(__dirname,'views','partials')
  }));
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname,'views'));
  
  app.use('/', express.static(path.join(__dirname,'public'), { maxAge: 86400000 }));
  

  callback(app, {mount_point: '/secure'});
};
