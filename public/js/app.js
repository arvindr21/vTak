'use strict';

var ngAuth = angular.module('ng-auth', ['ngRoute', 'ngResource', 'firebase', 'luegg.directives'])
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'partials/auth.html',
        controller: 'AuthCtrl'
      });
      $routeProvider.when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      });
      $routeProvider.when('/chat/:roomid', {
        templateUrl: 'partials/chat.html',
        controller: 'ChatCtrl'
      });
      $routeProvider.otherwise({
        redirectTo: '/'
      });
    }
  ])
