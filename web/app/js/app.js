// Declare app level module which depends on filters, and services
(function () {
  'use strict';
  angular.module('poa', [
    'ngRoute',
    'poa.services',
    'poa.controllers',
    'ngCookies',
    'ngAnimate',
    'ngQuickDate'
  ]).
  config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.when('/list', {templateUrl: 'partials/list.html', controller: 'ListCtrl as main'});
      $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: 'RegisterCtrl'});
      $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
      $routeProvider.when('/editera/:anmalanId', {templateUrl: 'partials/register.html', controller: 'EditAnmalanCtrl'});
      $routeProvider.when('/anmalan/:anmalanId', {templateUrl: 'partials/anmalan.html', controller: 'AnmalanCtrl as viewCtrl'});
      $routeProvider.when('/om', {templateUrl: 'partials/about.html', controller: 'AboutCtrl'});
      $routeProvider.otherwise({redirectTo: '/list'});

    }]).
  config(['ngQuickDateDefaultsProvider', function(ngQuickDateDefaultsProvider) {
      return ngQuickDateDefaultsProvider.set({
        dayAbbreviations: ["Sö", "Må", "Ti", "On", "To", "Fr", "Lö"],
        nextLinkHtml: 'Nästa &rarr;',
        prevLinkHtml: '&larr; Tidigare',
        dateFormat: 'yyyy-MM-dd',
        timeFormat: 'hh:mm'
      });
    }]);
  angular.module('poa.services', []);
  angular.module('poa.controllers', []);
})();