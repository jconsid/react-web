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
    $scope.setup = function() {
      $("input.label_better").label_better({
        position: "top",
        animationTime: 120,
        easing: "bounce",
        offset: 40,
        hidePlaceholderOnFocus: true
      });
      $("textarea.label_better").label_better({
        position: "top",
        animationTime: 120,
        easing: "bounce",
        offset: 60,
        hidePlaceholderOnFocus: true
      });
      alert("setup");
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



  .controller('LoginCtrl', ['$scope', 'global', 'LoginService', function($scope, global, loginService) {
    $scope.username = global.getUser();
    $scope.userLoggedIn = false;

    var loggedIn=function(error, results) {
      if (error == "ok") {
        $scope.userLoggedIn = true;
        global.setUser($scope.username);
        $scope.$apply();
      } else {
        alert(error);
      }
      $scope.username = global.getUser();
      $scope.$apply();
    }

    $scope.login = function() {
      loginService.login($scope.username, $scope.password, loggedIn);
    };

    $scope.logout = function() {
      global.setUser(null);
    };    
  }])


  .controller('TicketCtrl', ['$scope', 'TicketService', '$routeParams', 'global', function($scope, ts, $routeParams, global) {
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

    var formatted = function(unix_timestamp) {
      // create a new javascript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds
      var date = new Date(unix_timestamp);
      // hours part from the timestamp
      var hours = date.getHours();
      // minutes part from the timestamp
      var minutes = date.getMinutes();
      // seconds part from the timestamp
      var seconds = date.getSeconds();

      // will display time in 10:30:23 format
      var formattedTime = hours + ':' + minutes + ':' + seconds;
      return formattedTime;
    }

    function timeSince(date) {

      var seconds = Math.floor((new Date() - date) / 1000);

      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
          return interval + " år";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
          return interval + " månader";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
          return interval + " dagar";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
          return interval + " timmar";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
          return interval + " minuter";
      }
      return Math.floor(seconds) + " sekunder";
  }

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
      if (!$scope.logMessages) {
        $scope.logMessages = [];
      }

      $scope.showFieldsForNew = false;
      ts.addLogMessage($scope.ticket._id, _subject, _body, _user, function() {
        console.log("skapalog done");
      });

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
        console.log("TicketCtrl::reply status: ", status, reply);
        $scope.ticket = reply;
        $scope.logMessages = reply.loggar;
        $scope.$apply();
      };

      var concurrentUserCall = function(status, reply) {
        console.log("TicketCtrl::another user: ", status, reply);


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
                $scope.userMessages.push({messageNumer: msgCount++, logTime: reply.usage[i].logTime, text: user + " tittade på anmälan för " + timeSince(messageTime) + " sedan."});
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
