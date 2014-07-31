// Declare app level module which depends on filters, and services
(function () {
  'use strict';
  angular.module('poa', [
    'ngRoute',
    'poa.services',
    'poa.controllers',
    'ngCookies',
    'ngAnimate'
  ]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/list', {templateUrl: 'partials/list.html', controller: 'ListCtrl as main'});
    $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: 'RegisterCtrl'});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
    $routeProvider.when('/editera/:anmalanId', {templateUrl: 'partials/register.html', controller: 'EditAnmalanCtrl'});
    $routeProvider.when('/anmalan/:anmalanId', {templateUrl: 'partials/anmalan.html', controller: 'AnmalanCtrl as viewCtrl'});
    $routeProvider.when('/om', {templateUrl: 'partials/about.html', controller: 'AboutCtrl'});
    $routeProvider.otherwise({redirectTo: '/list'});
  }]);

  angular.module('poa.services', []);
  angular.module('poa.controllers', []);
})();