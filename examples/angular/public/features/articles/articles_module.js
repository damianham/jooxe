(function () {
  'use strict';

  angular
    .module('articles', [])
    .config(routeConfig)
    .run(menuConfig)
    .factory('ArticlesService', ArticlesService)
    .controller('ArticlesListController', ArticlesListController)
    .controller('ArticlesController', ArticlesController);

  ArticlesService.$inject = ['$resource'];

  function ArticlesService($resource) {
    return $resource('/api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }


  ArticlesListController.$inject = ['ArticlesService'];

  function ArticlesListController(ArticlesService) {
    var vm = this;

    vm.articles = ArticlesService.query();
  }

  ArticlesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'articleResolve'];

  function ArticlesController($scope, $state, $window, Authentication, article) {
    var vm = this;

    vm.authentication = Authentication;
    vm.article = article;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Article
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.article.$remove($state.go('articles.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.article._id) {
        vm.article.$update(successCallback, errorCallback);
      } else {
        vm.article.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('articles.view', {
          articleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Articles',
      state: 'articles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'List Articles',
      state: 'articles.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'Create Article',
      state: 'articles.create',
      roles: ['user']
    });
  }

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'features/articles/list-articles.client.view.html',
        controller: 'ArticlesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Articles List'
        }
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'features/articles/form-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: newArticle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Articles Create'
        }
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'features/articles/form-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getArticle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Article {{ articleResolve.name }}'
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'features/articles/view-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getArticle
        },
        data: {
          pageTitle: 'Article {{ articleResolve.name }}'
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'ArticlesService'];

  function getArticle($stateParams, ArticlesService) {
    return ArticlesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newArticle.$inject = ['ArticlesService'];

  function newArticle(ArticlesService) {
    return new ArticlesService();
  }
}());
