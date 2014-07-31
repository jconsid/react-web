(function () {
  'use strict';
  angular.module('myApp.controllers')
    .controller('AnmalanCtrl', ['$scope', 'AnmalanService', '$routeParams', 'PersonService', '$location', 'flash',
      function($scope, anmalanService, $routeParams, personService, $location, flash) {
        $scope.showLoggmeddelanden = true;
        $scope.showHandelser = false;
        $scope.showFieldsForNew = false;
        $scope.showFiler = false;
        $scope.isLoggedIn = false;
        $scope.ticket = $scope.ticket || {};
        $scope.showFieldsForNewFile = false;

        $scope.logMessages = [];

        var latestLogMessageLogTime = 0;
        var msgCount = 0;

        if (personService.isInitialized()) {
          $scope.isLoggedIn = true;
          $scope.loggedInUser = personService.getUsername();
        }

        this.gotoEdit = function() {
          console.log('$scope:', $scope.ticket);
          $location.path("/editera/" + $scope.ticket._id);
        };
        this.displayHandelser = function() {
          $scope.showHandelser = true;
          $scope.showLoggmeddelanden = false;
          $scope.showFiler = false;
        };
        this.displayLoggmeddelanden = function() {
          $scope.showLoggmeddelanden = true;
          $scope.showHandelser = false;
          $scope.showFiler = false;
        };
        this.displayFiler = function() {
          $scope.showLoggmeddelanden = false;
          $scope.showHandelser = false;
          $scope.showFiler = true;
        };
        $scope.startNew = function() {
          $scope.showFieldsForNew = true;
          $scope.showFieldsForNewFile = false;
        };
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
                window.alert("Något gick fel vid skapandet av ditt meddelande:" + reply.status);
              }
            );

          $scope.subject = null;
          $scope.body = null;
        };
        $scope.abortNew = function() {
          $scope.showFieldsForNew = false;
        };
        $scope.skickaTillPolisen = function( _user) {

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
                window.alert("Något gick fel när anmälan skickades till polisen:" + reply.status);
              }
            );
        };
        //New file
        $scope.startNewFile = function() {
          $scope.showFieldsForNewFile = true;
          $scope.showFieldsForNew = false;
        };
        $scope.setNewFile = function(_file) {
          $scope.newfile = _file;
        };
        $scope.saveNewFile = function(_user) {
          $scope.showFieldsForNewFile = false;

          anmalanService.addFile($scope.ticket._id, $scope.newfile, _user, function() {
            console.log("ladda upp fil done");
          });

          $scope.uploadfile = null;
          $scope.newfile = null;
        };
        $scope.abortNewFile = function() {
          $scope.showFieldsForNewFile = false;
        };
        $scope.findAnmalan = function() {
          var ticketCall = function(status, reply) {
            $scope.ticket = reply.results[0];
            if (reply.results[0].loggbok) {
              $scope.logMessages = reply.results[0].loggbok;
            }
            $scope.showFieldsForNew = $scope.logMessages.length === 0;
            
            $scope.$apply();
          };

          anmalanService.findOne($routeParams.anmalanId, ticketCall);
        };

        $scope.findAnmalan();
        if (!$scope.isLoggedIn) {
          // flash.setNotification("Du måste logga in för att kunna editera anmälan");
        }
      }
    ]);
})();