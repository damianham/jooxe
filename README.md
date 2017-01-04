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
framework (based on Apache Cordova).  Ideally I want to deploy an Ionic application to mobile and web with a Node.JS 
API backend.  I could of course deploy MEAN (or Rails) for the backend and the Ionic artifacts served from a static web server.  
However, a strong desire for a bit of tinkering being the mother of invention, here we are with a project to deploy web 
apps in various formats - based on MEAN in many ways - but maybe a bit easier to understand.

MEAN is great but there are a lot of files, in loads of folders with long filenames and deep paths and a lot of setup 
in configuration files making it difficult to trace how things work.  Sometimes I just want to throw
up a small site with a couple of pages and a bit of dynamic data or just an API backend etc.  

So there you have it, le raison d'être.  I hope you find this project useful.  Please fork and contribute, especially example apps.

### Requirements
 - [Node.js](https://nodejs.org/)
 - [Nginx](https://nginx.org/)  (to map domain names to sub applications)
 - [MongoDB](https://docs.mongodb.com/)  (for the Ionic example application)

### Installation

```sh
$ git clone https://github.com/damianham/jooxe.git
$ cd jooxe
$ npm install
$ mkdir apps
```

The technique used here is to mount sub applications into the main application and use a reverse proxy to access the sub app via a 
specific hostname.  If you trace through the jooxe boot process you will see it is quite simple.  

 - jooxe/server.js loads jooxe/server/app.js and calls the start() function in that file which calls the init() function
 - jooxe/server/apps.js init() function globs the apps folder for a specific filename **jooxe_app.js** which is considered
   a mount point for sub apps.
 - the subapp is loaded with require and it's init() function is called with a callback
 - the subapp.init() function create a new express app and then calls the callback function with the mount point and the new express app
 - the main app mounts the subapp at the given mount point

There are a number of example apps included in the **examples** folder, some are server side rendered apps and others 
client side rendered SPAs.  To see how the subapps are setup look at jooxe/examples/hello which is a super simple 
illustration of the concept.  Veggies is your next step to jooxe goodness - another super simple app that uses 
the express-hbs plugin to render dynamic content.  

Each example app has a corresponding Nginx configuration file in the **nginx** folder.  Nginx is a great web server that can be setup
as a reverse proxy and we use that to map domain names to a specific URI path, e.g. hello.example.com is mapped to jooxe/apps/hello etc.

To run one or more of the example apps you need to copy the example app folder to the 
apps folder and install the nginx configuration file and create the nginx static folder.  
For example, assuming that the Nginx configuration folder is
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
$ gulp
```
This will start the main app and watch the files in the apps folder for any changes.

The nginx configuration files map a different domain name to each example app.  For example to test the hello app and the veggies app
install the examples into the apps folder as above and setup the hostnames in /etc/hosts to point to the local host, e.g.

```sh
$ sudo echo "127.0.0.1  hello.example.com" >> /etc/hosts
$ sudo echo "127.0.0.1  veggies.example.com" >> /etc/hosts
```

If you now open a browser web page at http://hello.example.com you will see the output from the hello app.

The example apps use various concepts and could be helpful to illustrate how MEAN and express apps work.  One important point to note is that
Mongoose models must be unique across all apps.  So for example if you have an Article model in apps/angular and you want
articles in another app then the model must be called something else, e.g. AutoArticle (for the auto app).

#### Server side examples
 - hello - a simple app that displays Hello World
 - veggies - uses mustache style markup for dynamic web pages [express-hbs](https://github.com/barc/express-hbs) 
 - auto - a work in progress to discover views and controllers for dynamic routes
 - secure - adds some security features to express

### Client side examples
 - angular - an AngularJS SPA with API backend (run bower install to install dependencies)
 - ionic - an Ionic application with API backend

To get an Ionic app working create a new Ionic app with the ionic-cli and copy all of the contents to jooxe/apps/ionic. 
Then copy the contents of the ionic example
on top to overwrite some of the ionic starter artifacts. E.g.

```sh
$ cd (path to jooxe parent folder)
$ ionic new chats
$ mkdir -p jooxe/apps
$ mv chats jooxe/apps/ionic
$ cp -r jooxe/examples/ionic/* jooxe/apps/ionic
```
The ionic starter app has static Chats data in a Chat service.  The ionic example app in jooxe/examples/ionic overwrites some elements of the
ionic starter app and provide a backend api service to load chats data from a mongoDB database.

Once you have the domain name and nginx routing setup as above then visit http://ionic.example.com to see the ionic app in your web browser.

## Credits
Hats off to the [MEAN team](http://meanjs.org) for their great work.

##License

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