(function () {
  angular.module('myApp.controllers')
    .controller('ListCtrl', ['$scope', 'AnmalanService', function($scope, anmalanService) {
      $scope.tickets = [];
      $scope.systemEvents = [];
      $scope.toPresentation = function(anmalan) {
        var lasthandelse = anmalan.handelser[anmalan.handelser.length - 1];
        var typDesc = "uppdaterad";
        if (lasthandelse.typ === "logg") {
          typDesc += " med loggmeddelande";
        } else if (lasthandelse.typ === "skapad") {
          typDesc = " skapad";
        }
        return {
          titel: anmalan.titel,
          av: lasthandelse.person.firstname + " " + lasthandelse.person.lastname,
          anmalanId: anmalan._id,
          typ: typDesc
        };
      };
      $scope.update = function() {
        var s = anmalanService.findAll(function(status, reply) {
          $scope.tickets = reply;
          $scope.$apply();
        }, function(status, anmalanEvent) {
          var h = $scope.toPresentation(anmalanEvent);
          console.log("callback handelse", status, anmalanEvent, h);

          $scope.systemEvents.push(h);
          $scope.$apply();
        });
      };

      $scope.update();
    }
  ]);
})();