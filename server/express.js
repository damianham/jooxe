'use strict';

/**
 * Module dependencies.
 */
const config = require('./config'),
  express = require('express'),
  morgan = require('morgan'),
  logger = require('./logger'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  compress = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  path = require('path'),
  _ = require('lodash'),
	lusca = require('lusca');
 
/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
  // Setting application local variables 
  
  app.locals.livereload = config.livereload; 
  app.locals.env = process.env.NODE_ENV; 

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
  // Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));
 

  // Enable logger (morgan) if enabled in the configuration file
  if (_.has(config, 'log.format')) {
    app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
  }

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Add the cookie parser middleware
  app.use(cookieParser()); 
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
			host: '127.0.0.1',
        port: '27017',
        db: 'jooxe',
        url: 'mongodb://localhost:27017/jooxe',
      collection: config.sessionCollection
    })
  }));

  // Add Lusca CSRF Middleware
  app.use(lusca(config.csrf));
};


/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  // Initialize express app
  const app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app); 
	
  // Initialize Express session
  this.initSession(app, db);
 
  return app;
};
