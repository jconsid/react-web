(function () {
  'use strict';
  angular.module('poa.controllers')
    .controller('ListCtrl', ['$scope', 'AnmalanService', function($scope, anmalanService) {
      var cnt = 0;
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
          typ: typDesc,
          ordinal: cnt++
        };
      };
      this.update = function() {
        var s = anmalanService.findAll(function(status, reply) {
          $scope.tickets = reply;
          $scope.$apply();
        }, function(status, anmalanEvent) {
          var h = thiz.toPresentation(anmalanEvent);

          thiz.systemEvents.push(h);
          thiz.scope.$apply();
        });
      };
      
      this.update();
    }
  ]);
})();