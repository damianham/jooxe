/* 
 * example app to renders a JSON object with the text 'hello world' mounted on /hello
 */

var express = require("express"),
  favicon = require('serve-favicon'), 
  fs = require('fs'),
  path = require('path'),
  hbs = require('express-hbs');   //  https://github.com/barc/express-hbs

module.exports.init = function(callback) {
  var app = express();
   
  // Initialize favicon middleware
  if (fs.exists('public/img/brand/favicon.ico')) {
    app.use(favicon('public/img/brand/favicon.ico'));
  } 
  
  app.use('/', express.static(path.join(__dirname,'public'), { maxAge: 86400000 }));
 
  app.use('/world',function(req,res){
    res.json({text: "Hello world"});
  });

  callback(app, {mount_point: '/hello'});
};
