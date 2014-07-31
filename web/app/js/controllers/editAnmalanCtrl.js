(function () {
  angular.module('myApp.controllers').
    controller("EditAnmalanCtrl", ['$scope', '$routeParams', '$location', 'flash', 'AnmalanService', 'PersonService', function($scope, $routeParams, $location, flash, anmalanService, personService) {
      $scope.isRegisterNew = false;
      $scope.userLoggedIn = personService.isInitialized();
      if (!$scope.userLoggedIn) {
        flash.setMessage("Logga in först, för att editera en anmälan");
        $location.path("/login/");
        $scope.$apply();
        return;
      }

      var anmalanFetched = function(status, reply) {
          $scope.anmalan = reply.results[0];
          $scope.$apply();
      };

      anmalanService.findOne($routeParams.anmalanId, anmalanFetched);
      $scope.saveAnmalan = function(anmalan) {
        $.when(
          anmalanService.save(angular.copy(anmalan))
        ).done(
          function(newId) {
            flash.setNotification("Anmälan uppdaterad");
            $scope.$apply();
          }
        ).fail(
          function(reply) {
            window.alert("Kunde inte spara (uppdaterad) anmälan\n" + reply);
          }
        );
      };
    }]);
})();