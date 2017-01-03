/* 
 * bootstrap the ionic app - e.g. connect to the database, inject some test data
 */

var config = require('./config'),
  mongoose = require('mongoose'),
  Chat = mongoose.model('IonicChat');

module.exports = function (app) {

  var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
    // Log Error
    if (err) {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);

      return;
    } else {

      mongoose.Promise = global.Promise;

      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);
    }
  });

  Chat.where({}).count(function (err, count) {

    if (count > 0)
      return;

    // insert chats
    // Some fake testing data
    var chats = [{
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/ben.png'
      }, {
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
      }, {
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
      }, {
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
      }, {
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
      }]; 

    console.log('inserting 5 chats')

    chats.forEach((data) => {
      var chat = new Chat(data);
      chat.save(function (err) {
        if (err) {
          console.log('error inserting new chat', err);
        }
      });

    });

  }); 


};
