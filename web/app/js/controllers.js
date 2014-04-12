'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('RegisterCtrl', [ '$scope', function($scope) {
    
      $scope.setup = function() {

        $('.FlowupLabels').FlowupLabels({
            feature_onInitLoad: false
          });
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


  .controller('TicketCtrl', ['$scope', 'TicketService', 'TimeDisplayService', '$routeParams', 'global', function($scope, ts, displayTime, $routeParams, global) {
    $scope.userMessages = [];
    $scope.showFieldsForNew = false;
    $scope.isLoggedIn = false;
    $scope.ticket = {};
    $scope.logMessages;
    $scope.showFieldsForNewFile = false;
    $scope.newfile;
    var ONE_HOUR = 60 * 60 * 1000;
    var openingTime = new Date();
    var latestLogMessageLogTime = 0;
    var msgCount = 0;

    if (global.isAuth()) {
      $scope.isLoggedIn = true;
      $scope.loggedInUser = global.getUser();
    }
    /*var setup = function() {
      $("#userMessagesUl").addClass("anim");
    }*/
    $scope.startNew = function() {
      $scope.showFieldsForNew = true;
      $scope.showFieldsForNewFile = false;
    }
    $scope.saveNew = function(_subject, _body, _user) {
      if (!$scope.logMessages) {
        $scope.logMessages = [];
      }

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
        $scope.ticket = reply;
        $scope.logMessages = reply.loggar;
        $scope.$apply();
      };

      var concurrentUserCall = function(status, reply) {
        console.log("TicketCtrl::another user: ", status, reply.query.matcher._id);
        if (!$scope.ticket._id || reply.query.matcher._id != $scope.ticket._id) {
          return;
        }

        for(var i = 0; i < reply.usage.length; i++) {
          if (reply.usage[i].logTime > latestLogMessageLogTime) {
            latestLogMessageLogTime = reply.usage[i].logTime;
            var messageTime = new Date(reply.usage[i].logTime);
            if (((new Date) - messageTime) < ONE_HOUR) {
              if (messageTime <= openingTime ||
                  reply.usage[i].username != $scope.loggedInUser) {
                var user = reply.usage[i].username;
                if (user == $scope.loggedInUser) {
                  user = "Du";
                }
                var time = displayTime.timeSince(messageTime);
                var userMsg;
                if (!time) {
                  userMsg = user + " tittar på anmälan nu.";
                } else {
                  userMsg = user + " tittade på anmälan för " + displayTime.timeSince(messageTime) + " sedan.";
                }
                $scope.userMessages.push({messageNumer: msgCount++, logTime: reply.usage[i].logTime, text: userMsg});
              }
            }
          }
        }

        $scope.$apply();
      };

      var logMessageCreated = function(status, reply) {
        console.log("TicketCtrl::another log message: ", status, reply);

        $scope.logMessages.push(reply);
        
        $scope.$apply();
      };

      var s = ts.findOne($routeParams.ticketId,
        $scope.loggedInUser,
        ticketCall,
        concurrentUserCall,
        logMessageCreated
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
