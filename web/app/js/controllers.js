'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('RegisterCtrl', [ '$scope', 'AnmalanService', function($scope, anmalanService) {
      $scope.ticket = {
        reporter:"",
        subject:"",
        gadget:"",
        currentPriceSEK:"",
        description:""
      };
    
      $scope.setup = function() {
        $('.FlowupLabels').FlowupLabels({
            feature_onInitLoad: false
          });
      }

      $scope.saveAnmalan = function(anmalan) {
        anmalanService.save(anmalan);
      }
    }
  ])

  .controller('AdminLogCtrl', [function() {

  }])

  .controller('LoginCtrl', ['$scope', 'global', 'LoginService',
    function($scope, global, loginService) {

      $scope.username = global.getUser();
      $scope.userLoggedIn = false;

      var loggedIn=function() {

        $scope.userLoggedIn = true;
        global.setUser($scope.username);
        $scope.$apply();

        $scope.username = global.getUser();
        $scope.$apply();
      }

      $scope.login = function() {
        $.when(
          loginService.login($scope.username, $scope.password)
        ).done(
          function() {
            loggedIn();
            window.location.href="#/list";
          }
        ).fail(
          function() {
            alert("Bad username or password");
          }
        )
      };

      $scope.logout = function() {
        global.setUser(null);
      };    
  }])


  .controller('AnmalanCtrl', ['$scope', 'AnmalanService', '$routeParams', 'global',
    function($scope, anmalanService, $routeParams, global) {
      $scope.showFieldsForNew = false;
      $scope.isLoggedIn = false;
      $scope.ticket = {};
      $scope.showFieldsForNewFile = false;
      $scope.newfile;
      $scope.logMessages = [];

      var latestLogMessageLogTime = 0;
      var msgCount = 0;

      if (global.isAuth()) {
        $scope.isLoggedIn = true;
        $scope.loggedInUser = global.getUser();
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
      $scope.skickaTillPolisen = function(_user) {
            console.log("Skicka till polisen");
          $.when(
              ts.skickaTillPolisen($scope.ticket._id, $scope.ticket.subject, $scope.ticket.description, _user))
            .done(
              function(reply) {
                console.log('skickaTillPolisen ok', reply);
                $scope.findTicket();
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
          $scope.logMessages = reply.results[0].loggar;
          $scope.$apply();
        };

        var s = anmalanService.findOne(parseInt($routeParams.anmalanId),
          $scope.loggedInUser,
          ticketCall
        );
      };
      $scope.findAnmalan();
    }
  ])
  
  .controller('ListCtrl', ['$scope', 'AnmalanService', function($scope, anmalanService) {
    $scope.tickets = [];
    $scope.systemEvents = [];
    $scope.update = function() {
      var s = anmalanService.findAll(function(status, reply) {
        console.log("ListCtrl::reply status: ", status);
        $scope.tickets = reply;
        $scope.$apply();
      }, function(status, anmalanEvent) {
        console.log("callback", status, anmalanEvent);
        $scope.systemEvents.push(anmalanEvent);
        console.log("callback", $scope.systemEvents);
        $scope.$apply();
      });
    };

    $scope.update();
  }
]);
