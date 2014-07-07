'use strict';

/* Controllers 
presentation av tid...
presentation av anmalan-sida, som händelse-lista...
*/


angular.module('myApp.controllers', []).
  controller("MsgCtrl", function($scope, $location, flash) {
    $scope.flash = flash;
    $scope.message = "Hello World";
  }).
  controller("EditAnmalanCtrl", ['$scope', '$routeParams', '$location', 'flash', 'AnmalanService', 'PersonService', function($scope, $routeParams, $location, flash, anmalanService, personService) {
    $scope.isRegisterNew = false;
    $scope.userLoggedIn = personService.isInitialized();
    if (!$scope.userLoggedIn) {
      flash.setMessage("Logga först, för att editera en anmälan");
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
          alert("Kunde inte spara (uppdaterad) anmälan\n" + reply);
        }
      );
    };
  }]).
  
  controller('RegisterCtrl', [ '$scope', '$location', 'AnmalanService', 'flash', 'PersonService', function($scope, $location, anmalanService, flash, personService) {
    $scope.setupNewStuletObjekt = function () {
        $scope.newStuletObjekt = {
          namn: null,
          beskrivning: null,
          typ: null,
          stoldmarkning: 'Nej',
          maskinId: null
        }
        $scope.anmalan.stulnaObjekt.push($scope.newStuletObjekt);
      }


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
            alert("Kunde inte spara anmälan\n" + reply);
          }
        );
      }

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
  ])

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
        )
      };

      $scope.logout = function() {
        $scope.userLoggedIn = false;
        personService.kill();
        flash.setNotification('Du är inte längre inloggad');
      };    
  }])


  .controller('AnmalanCtrl', ['$scope', 'AnmalanService', '$routeParams', 'PersonService', '$location', 'flash',
    function($scope, anmalanService, $routeParams, personService, $location, flash) {
      $scope.showLoggmeddelanden = true;
      $scope.showHandelser = false;
      $scope.showFieldsForNew = false;
      $scope.isLoggedIn = false;
      $scope.ticket = {};
      $scope.showFieldsForNewFile = false;
      $scope.newfile;
      $scope.logMessages = [];

      var latestLogMessageLogTime = 0;
      var msgCount = 0;

      if (personService.isInitialized()) {
        $scope.isLoggedIn = true;
        $scope.loggedInUser = personService.getUsername();
      }
      $scope.gotoEdit = function() {
        $location.path("/editera/" + $scope.ticket._id);
      }
      $scope.displayHandelser = function() {
        $scope.showHandelser = true;
        $scope.showLoggmeddelanden = false;
      }
      $scope.displayLoggmeddelanden = function() {
        $scope.showLoggmeddelanden = true;
        $scope.showHandelser = false;
      }
      $scope.startNew = function() {
        $scope.showFieldsForNew = true;
        $scope.showFieldsForNewFile = false;
      }
      $scope.saveNew = function(_subject, _body, _user) {

        $scope.showFieldsForNew = false;
        $.when(
            anmalanService.addLogMessage($scope.ticket._id, _subject, _body, _user))
          .done(
            function(reply) {
              console.log('addLogMessage ok', reply);
              $scope.findAnmalan();
            }
          ).fail(
            function(reply) {
              console.log('addLogMessage ERROR', reply);
              alert("Något gick fel vid skapandet av ditt meddelande:" + reply.status);
            }
          );

        $scope.subject = null;
        $scope.body = null;
      }
      $scope.abortNew = function() {
        $scope.showFieldsForNew = false;
      }
      $scope.skickaTillPolisen = function( _user) {
            console.log("Skicka till polisen");
          $.when(
              anmalanService.skickaTillPolisen($scope.ticket._id, $scope.ticket.titel, _user))
            .done(
              function(reply) {
                console.log('skickaTillPolisen ok', reply);
                $scope.findAnmalan();
              }
            ).fail(
              function(reply) {
                console.log('skickaTillPolisen ERROR', reply);
                alert("Något gick fel när anmälan skickades till polisen:" + reply.status);
              }
            );
        }
      //New file
      $scope.startNewFile = function() {
        $scope.showFieldsForNewFile = true;
        $scope.showFieldsForNew = false;
      }
      $scope.setNewFile = function(_file) {
        $scope.newfile = _file;
      }
      $scope.saveNewFile = function(_user) {
        $scope.showFieldsForNewFile = false;

        anmalanService.addFile($scope.ticket._id, $scope.newfile, _user, function() {
          console.log("ladda upp fil done");
        });

        $scope.uploadfile = null;
        $scope.newfile = null;
      }
      $scope.abortNewFile = function() {
        $scope.showFieldsForNewFile = false;
      }
      $scope.findAnmalan = function() {
        var ticketCall = function(status, reply) {
          $scope.ticket = reply.results[0];
          if (reply.results[0].loggbok) {
            $scope.logMessages = reply.results[0].loggbok;
          }
          $scope.showFieldsForNew = $scope.logMessages.length == 0;
          
          $scope.$apply();
        };

        var s = anmalanService.findOne($routeParams.anmalanId, ticketCall);
      };
      $scope.findAnmalan();
      if (!$scope.isLoggedIn) {
        // flash.setNotification("Du måste logga in för att kunna editera anmälan");
      }
    }
  ])
  
  .controller('ListCtrl', ['$scope', 'AnmalanService', function($scope, anmalanService) {
    $scope.tickets = [];
    $scope.systemEvents = [];
    $scope.toPresentation = function(anmalan) {
      var lasthandelse = anmalan.handelser[anmalan.handelser.length - 1];
      var typDesc = "uppdaterad";
      if (lasthandelse.typ == "logg") {
        typDesc += " med loggmeddelande"
      } else if (lasthandelse.typ == "skapad") {
        typDesc = " skapad"
      }
      return {
        titel: anmalan.titel,
        av: lasthandelse.person.firstname + " " + lasthandelse.person.lastname,
        anmalanId: anmalan._id,
        typ: typDesc
      }
    }
    $scope.update = function() {
      var s = anmalanService.findAll(function(status, reply) {
        $scope.tickets = reply;
        $scope.$apply();
      }, function(status, anmalanEvent) {
        var h = $scope.toPresentation(anmalanEvent)
        console.log("callback handelse", status, anmalanEvent, h);

        $scope.systemEvents.push(h);
        $scope.$apply();
      });
    };

    $scope.update();
  }
]);
