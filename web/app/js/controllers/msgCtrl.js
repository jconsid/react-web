(function () {
  'use strict';
  angular.module('myApp.controllers').
    controller("MsgCtrl", ['$scope', 'flash', function($scope, flash) {
      $scope.flash = flash;
    }]);
})();