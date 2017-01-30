'use strict';

/**
 * Module dependencies
 */
var chatsPolicy = require('./chats.server.policy'),
  schema = require('./chat.server.model'),
  chats = require('./chats.server.controller');

chatsPolicy.invokeRolesPolicies();

module.exports = function(app) {
  
  //create the model on the subapp using the db for this subapp
  app.locals.Chat = app.db.model('Chat',schema);
  
  // Articles Routes
  app.route('/api/chats').all(chatsPolicy.isAllowed)
    .get(chats.list)
    .post(chats.create);

  app.route('/api/chats/:chatId').all(chatsPolicy.isAllowed)
    .get(chats.read)
    .put(chats.update)
    .delete(chats.delete);

  // Finish by binding the Article middleware
  app.param('chatId', chats.chatByID);
};

