(function () {
  'use strict';
  angular.module('poa.controllers')
    .controller('LoginCtrl', ['$scope', 'LoginService', '$location', 'flash', 'PersonService',
      function($scope, loginService, $location, flash, personService) {
        $scope.username = personService.getUsername();
        $scope.userLoggedIn = personService.isInitialized();
        
        if($scope.userLoggedIn) {
          $scope.fullName = personService.getPerson().firstname + " " + personService.getPerson().lastname; 
        }

        if ($scope.userLoggedIn) {
          flash.setNotification('Du är redan inloggad som ' + $scope.fullName + ' (' + $scope.username + ')');
        }

        $scope.login = function() {
          $.when(
            loginService.login($scope.username, $scope.password)
          ).done(
            function(personAggr) {

              flash.setMessage('Du är inloggad som ' + personAggr.person.firstname + ' ' + personAggr.person.lastname + ' (' + $scope.username + ')');
              console.log("Inloggad", personAggr);
              $location.path("/list");
              $scope.$apply();
            }
          ).fail(
            function() {
              flash.setNotification('Felaktigt användarnamn eller lösenord');
            }
          );
        };

        $scope.logout = function() {
          $scope.userLoggedIn = false;
          personService.kill();
          flash.setNotification('Du är inte längre inloggad');
        };    
    }]);
})();