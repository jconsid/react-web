(function () {
  'use strict';
  angular.module('myApp.controllers')
    .controller('ListCtrl', ['$scope', 'AnmalanService', function($scope, anmalanService) {
      this.tickets = [];
      this.systemEvents = [];
      this.scope = $scope;
      var thiz = this;
      this.toPresentation = function(anmalan) {
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
      this.update = function() {
        var s = anmalanService.findAll(function(status, reply) {
          $scope.tickets = reply;
          $scope.$apply();
        }, function(status, anmalanEvent) {
          var h = this.toPresentation(anmalanEvent);
          console.log("callback handelse", status, anmalanEvent, h);

          this.systemEvents.push(h);
          $scope.$apply();
        });
      };
      
      this.update();
    }
  ]);
})();