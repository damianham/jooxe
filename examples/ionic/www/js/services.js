angular.module('starter.services', [])

.factory('Chats', ['$resource', function($resource) {
 
  return $resource('/api/chats/:chatId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

}]);
