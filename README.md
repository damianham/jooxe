# jooxe

#### Host multiple web applications in a single NodeJS instance

I have a number of very low traffic websites running on a VPS, each one requiring a separate NodeJS instance.  
This project is an attempt to run these low traffic websites inside a single NodeJS instance.  

There are 2 kinds of web applications 
 - server side rendered apps
 - client side rendered apps.

Now I am a huge fan of Ruby and Ruby on Rails but for quite some time now I have been an 
SPA(Single Page Application - client side rendering) kind of guy and Rails is a server side rendering framework.  
You can of course use Rails for an api backend but I found the
[MEAN.JS web stack ](https://www.meanjs.org "MEAN JS full stack solution for web apps") to be an excellent platform to build SPAs.

More recently my projects tend to be based on [Ionic](http://ionicframework.com/) which is essentially a mobile 
framework (based on Apache Cordova).  Ideally I want to deploy an Ionic applicaiton to mobile and web with a Node.JS 
API backend.  I could of course deploy MEAN (or Rails) for the backend and the Ionic artifacts served from a static web server.  
However a strong desire for a bit of tinkering being the mother of invention here we are with a project to deploy web 
apps in various formats - based on MEAN in many ways - but maybe a bit easier to understand.

MEAN is great but there are a lot of files, in loads of folders with long filenames and deep paths and a lot of setup 
in configuration files making it difficult to trace how things work.  Sometimes I just want to throw
up a small site with a couple of pages and a bit of dynamic data or just an API backend etc. 

So there you have it, le raison d'être.  I hope you find this project useful.  Please fork and contribute, especially example apps.

The technique used here is to mount sub applications into the main application and use a reverse proxy to access the sub app via a 
specific hostname.

### Requirements
 - [Node.js](https://nodejs.org/)
 - [Nginx](https://nginx.org/)

### Installation

```sh
$ git clone https://github.com/damianham/jooxe.git
$ cd jooxe
$ npm install
```

There are a number of example apps included in the **examples** folder, some are server side rendered apps and others client side rendered SPAs.  
Each example app has a corresponding Nginx configuration file in the **nginx** folder.  
To run one or more of the example apps you need to copy the example app folder to the 
apps folder and install the nginx configuration file and create the nginx static folder.  For example, assuming that the Nginx configuration folder is
/usr/local/etc/nginx and the default document root is /usr/local/var/www

```sh
$ cp -R examples/hello examples/veggies apps
$ cp nginx/hello nginx/veggies /usr/local/etc/nginx/servers
$ mkdir -p /usr/local/var/jooxe/apps/hello/releases/1/public
$ mkdir -p /usr/local/var/jooxe/apps/hello/releases/1/log
$ ln -s /usr/local/var/jooxe/apps/hello/releases/1 /usr/local/var/jooxe/apps/hello/current
$ mkdir -p /usr/local/var/jooxe/apps/veggies/releases/1/public
$ mkdir -p /usr/local/var/jooxe/apps/veggies/releases/1/log
$ ln -s /usr/local/var/jooxe/apps/veggies/releases/1 /usr/local/var/jooxe/apps/veggies/current
```

Then start or reload nginx (as root if you want to access on port 80) and start node in the jooxe folder with 
```sh
$ node server.js
```

#### Server side examples
 - hello - a simple app that displays Hello World
 - veggies - uses mustache style markup for dynamic web pages [express-hbs](https://github.com/barc/express-hbs) 
 - auto - a work in progress to discover views and controllers for dynamic routes

### Client side examples
 - angular - an AngularJS SPA with API backend
 - ionic - an Ionic application with API backend


License

The MIT License (MIT)

Copyright (c) 2016 Damian Hamill

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation 
files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, 
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR 
IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.