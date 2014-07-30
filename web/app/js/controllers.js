

/* Controllers 
presentation av tid...
presentation av anmalan-sida, som händelse-lista...
*/


(function () {
  angular.module('myApp.controllers').
    controller("MsgCtrl", ['$scope', 'flash', function($scope, flash) {
      $scope.flash = flash;
    }]);
})();

(function () {
angular.module('myApp.controllers').
  controller("AboutCtrl", function($scope) {

  });
})();

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

(function () {
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

(function () {
  angular.module('myApp.controllers')
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

