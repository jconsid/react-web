'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('RegisterCtrl', [ '$scope', 'ReceiverSampleService', function($scope, rss) {
    $scope.statusText = "Prova ping knappen";
    $scope.ping = function() {
      rss.ping(function(err, results) {
        console.log("err: ", err);
        console.log("results: ", results);
        $scope.statusText = results;
        $scope.$apply();
      });

    }
  }])


  .controller('AdminLogCtrl', [function() {

  }])



  .controller('LoginCtrl', ['$scope', 'LoginService', function($scope, loginService) {
    $scope.username = "admin";
    $scope.userLoggedIn = false;

    var loggedIn=function(error, results) {
      if (error == "ok") {
        console.log("userLoggedIn = true");
        $scope.userLoggedIn = true;
        $scope.$apply();
      } else {
        alert(error);
        console.log("userLoggedIn = false");
      }
    }

    $scope.login = function() {
      loginService.login($scope.username, $scope.password, loggedIn);
    };

    
  }])

  
  .controller('ListCtrl', ['$scope', 'TicketService', "SearchLogService", function($scope, ts, sls) {
    $scope.tickets = [];
    $scope.update = function() {
      var s = ts.findAll(function(status, reply) {
        console.log("ListCtrl::reply status: ", status);
        console.log("ListCtrl::reply body: ", reply);
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
