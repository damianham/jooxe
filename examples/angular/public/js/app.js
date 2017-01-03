// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// ,'jooxe.controllers', 'jooxe.services', 'jooxe.directives'
angular.module('jooxe', ['ngResource', 'ui.router', 'jooxe.config', 'jooxe.controllers', 'jooxe.services', 'jooxe.directives'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('home', {
    url: '/',
    views: {
      'tab-dash': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});

