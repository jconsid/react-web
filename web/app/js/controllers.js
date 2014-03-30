'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('RegisterCtrl', [ '$scope', 'ReceiverSampleService', function($scope, rss) {
    $scope.statusText = "Prova ping knappen";
    
    $scope.ping = function() {
      rss.ping(
        function(err, results) {
          console.log("err: ", err);
          console.log("results: ", results);
          $scope.statusText = results;
          $scope.$apply();
        });
    }
  }])


  .controller('AdminLogCtrl', [function() {

  }])



  .controller('LoginCtrl', ['$scope', 'global', 'LoginService', function($scope, global, loginService) {
    $scope.username = global.getUser();
    $scope.userLoggedIn = false;

    var loggedIn=function(error, results) {
      if (error == "ok") {
        console.log("userLoggedIn = true");
        $scope.userLoggedIn = true;
        global.setUser($scope.username);
        $scope.$apply();
      } else {
        alert(error);
        console.log("userLoggedIn = false");
      }
      $scope.username = global.getUser();
      $scope.$apply();
    }

    $scope.login = function() {
      loginService.login($scope.username, $scope.password, loggedIn);
    };

    
  }])


  .controller('TicketCtrl', ['$scope', 'TicketService', '$routeParams', 'global', function($scope, ts, $routeParams, global) {
    $scope.userMessages = [];
    $scope.showFieldsForNew = false;
    $scope.ticket = {};
    $scope.logMessages = [{subject:"kalle", body:"Lite text här"}];
    var msgCount = 0;
    
    if (global.isAuth()) {
      $scope.loggedInMessage = "Du är inloggad som " + global.getUser();  
    } else {
      $scope.loggedInMessage = "Du är inte inloggad";
    }
    $scope.startNew = function() {
      $scope.showFieldsForNew = true;
    }
    $scope.saveNew = function(_subject, _body) {
      if (!$scope.logMessages) {
        $scope.logMessages = [];
      }
      $scope.logMessages.push({subject:_subject, body:_body})

      $scope.showFieldsForNew = false;
      ts.addLogMessage($scope.ticket._id, _subject, _body, function() {
        console.log("skapalog done");
      });


      $scope.subject = null;
      $scope.body = null;
    }
    $scope.abortNew = function() {
      $scope.showFieldsForNew = false;
    }
    $scope.findTicket = function() {
      var ticketCall = function(status, reply) {
        console.log("TicketCtrl::reply status: ", status, reply);
        $scope.ticket = reply;
        $scope.logMessages = reply.loggar;
        $scope.$apply();
      };

      var concurrentUserCall = function(status, reply) {
        console.log("TicketCtrl::another user: ", status, reply);
        $scope.userMessages.push({messageNumer: msgCount, text: "En annan avändare tittar på ansökan"});
        $scope.$apply();
      };

      var s = ts.findOne($routeParams.ticketId,
        ticketCall,
        concurrentUserCall
        );
    };
    $scope.findTicket();
    
  }])



  
  .controller('ListCtrl', ['$scope', 'TicketService', "SearchLogService", function($scope, ts, sls) {
    $scope.tickets = [];
    $scope.update = function() {
      var s = ts.findAll(function(status, reply) {
        console.log("ListCtrl::reply status: ", status);
        // console.log("ListCtrl::reply body: ", reply);
        $scope.tickets = reply;
        $scope.$apply();
      });
    };

    $scope.logSearch = function(){
        var searchString = $scope.query;
        console.log("Sökte efter: " + searchString);
        sls.sendSearchLog(searchString);
    }
    $scope.update();
  }]);
