(function () {
  'use strict';
  angular.module('poa.controllers').
    controller("MsgCtrl", ['$scope', 'flash', function($scope, flash) {
      $scope.flash = flash;
    }]);
})();