(function () {
  'use strict';
  angular.module('myApp.controllers').
    controller('RegisterCtrl', [ '$scope', '$location', 'AnmalanService', 'flash', 'PersonService', function($scope, $location, anmalanService, flash, personService) {
      $scope.setupNewStuletObjekt = function () {
          $scope.newStuletObjekt = {
            namn: null,
            beskrivning: null,
            typ: null,
            stoldmarkning: 'Nej',
            maskinId: null
          };
          $scope.anmalan.stulnaObjekt.push($scope.newStuletObjekt);
        };

        $scope.saveAnmalan = function(anmalan) {

          $.when(
            anmalanService.create(angular.copy(anmalan))
          ).done(
            function(newId) {
              flash.setMessage("Anmälan sparad");
              $location.path("/anmalan/" + newId);
              $scope.$apply();
            }
          ).fail(
            function(reply) {
              window.alert("Kunde inte spara anmälan\n" + reply);
            }
          );
        };

        $scope.isRegisterNew = true;
        $scope.userLoggedIn = personService.isInitialized();

        if (!$scope.userLoggedIn) {
          flash.setMessage("Logga först, för att skapa en anmälan");
          flash.setMessage("Logga först, för att skapa en anmälan");
          $location.path("/login/");
        } else {
          $scope.anmalan = anmalanService.newAnmalanInstance(
            personService.getPersonToAttach(),
            personService.getOrganisation()
          );
          $scope.username = personService.getUsername();

          $scope.setupNewStuletObjekt();
        }      
      }
    ]);
})();