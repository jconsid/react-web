'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('RegisterCtrl', [ '$scope', function($scope) {
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

      $scope.saveTicket = function(ticket) {
        console.log("save", ticket);
      }
  }])

  .controller('PingCtrl', [ '$scope', 'ReceiverSampleService', function($scope, rss) {
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


  .controller('TicketCtrl', ['$scope', 'TicketService', '$routeParams', 'global', function($scope, ts, $routeParams, global) {
    $scope.showFieldsForNew = false;
    $scope.isLoggedIn = false;
    $scope.ticket = {};
    $scope.showFieldsForNewFile = false;
    $scope.newfile;

    var openingTime = new Date();
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
          ts.addLogMessage($scope.ticket._id, _subject, _body, _user))
        .done(
          function(reply) {
            console.log('addLogMessage ok', reply);
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
    $scope.startNewFile = function() {
      $scope.showFieldsForNewFile = true;
      $scope.showFieldsForNew = false;
    }
    $scope.setNewFile = function(_file) {
      $scope.newfile = _file;
    }
    $scope.saveNewFile = function(_user) {
      $scope.showFieldsForNewFile = false;

      ts.addFile($scope.ticket._id, $scope.newfile, _user, function() {
        console.log("ladda upp fil done");
      });

      $scope.uploadfile = null;
      $scope.newfile = null;
    }
    $scope.abortNewFile = function() {
      $scope.showFieldsForNewFile = false;
    }
    $scope.findTicket = function() {
      var ticketCall = function(status, reply) {
        console.log("reply", reply);
        $scope.ticket = reply.results[0];
        $scope.logMessages = reply.loggar;
        $scope.$apply();
      };


      var s = ts.findOne(parseInt($routeParams.ticketId),
        $scope.loggedInUser,
        ticketCall
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
