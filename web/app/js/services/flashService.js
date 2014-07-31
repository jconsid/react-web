(function () {
  'use strict';
angular.module('myApp.services').
  factory("flash", ['$rootScope', function($rootScope) {
    var queue = [];
    var currentMessage = "";

    $rootScope.$on("$routeChangeSuccess", function() {
      console.log("$routeChangeSuccess", currentMessage, queue);
      currentMessage = queue.shift() || "";
    });

    /* Lägger till denna scroll-fix här, inte för att det är ett bra ställe - utan för att flash används överallt */
    $rootScope.$on("$routeChangeSuccess", function(){
       window.scrollTo(0,0);
    });

    return {
      setNotification: function(message) {
        currentMessage = message;
      },
      setMessage: function(message) {
        queue.push(message);
      },
      getMessage: function() {
        return currentMessage;
      }
    };
  }]);
})();