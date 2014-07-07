'use strict';


// Declare app level module which depends on filters, and services
// 'knalli.angular-vertxbus'

angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ngCookies',
  'ngAnimate'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/list', {templateUrl: 'partials/list.html', controller: 'ListCtrl'});
  $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: 'RegisterCtrl'});
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
  $routeProvider.when('/editera/:anmalanId', {templateUrl: 'partials/register.html', controller: 'EditAnmalanCtrl'});
  $routeProvider.when('/anmalan/:anmalanId', {templateUrl: 'partials/anmalan.html', controller: 'AnmalanCtrl'});
  $routeProvider.otherwise({redirectTo: '/list'});
}]);

