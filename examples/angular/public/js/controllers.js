angular.module('jooxe.controllers', [])

.controller('AppCtrl', ['$scope', '$state',
  function($scope, $state) {


  }])

.controller('HeaderController', ['$scope', '$state', 'Authentication', 'menuService',
  function($scope, $state, Authentication, menuService) {

    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

  }])


.controller('DashCtrl', ['$scope', '$controller', function($scope, $controller) {

  $controller('AppCtrl', { $scope: $scope });


}])

.controller('ChatsCtrl', ['$scope', '$controller', 'Chats', function($scope, $controller, Chats) {

  $controller('AppCtrl', { $scope: $scope });

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  // $scope.$on('$ionicView.enter', function(e) {
  // });

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
}])

.controller('ChatDetailCtrl', ['$scope', '$controller', '$stateParams', 'Chats', function($scope, $controller, $stateParams, Chats) {

  $controller('AppCtrl', { $scope: $scope });

  $scope.chat = Chats.get($stateParams.chatId);
}])

.controller('ArticlesCtrl', ['$scope', '$controller', 'Articles', function($scope, $controller, Articles) {

  $controller('AppCtrl', { $scope: $scope });

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  // $scope.$on('$ionicView.enter', function(e) {
  // });

  $scope.articles = Articles.all();
  $scope.remove = function(article) {
    Articles.remove(article);
  };


}])

.controller('ArticleDetailCtrl', ['$scope', '$controller', '$stateParams', 'Chats', function($scope, $controller, $stateParams, Articles) {

  $controller('AppCtrl', { $scope: $scope });

  $scope.article = Articles.get($stateParams.articleId);
}])

.controller('AccountCtrl', ['$scope', '$controller', function($scope, $controller) {

  $controller('AppCtrl', { $scope: $scope });

  $scope.settings = {
    enableFriends: true
  };
}]);
