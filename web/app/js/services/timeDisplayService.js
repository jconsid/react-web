(function () {
  'use strict';
  angular.module('myApp.services')
    .service('TimeDisplayService', [function() {
      this.timeSince = function(date) {
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
        if (interval === 1) {
          return "en dag";
        } else if (interval > 1) {
          return interval + " dagar";
        }
        interval = Math.floor(seconds / 3600);
        if (interval === 1) {
          return "en timme";
        } else if (interval > 1) {
          return interval + " timmar";
        }
        interval = Math.floor(seconds / 60);
        if (interval === 1) {
          return "en minut";
        } else if (interval > 1) {
          return interval + " minuter";
        }
        interval = Math.floor(seconds);
        if (interval === 1) {
          return "en sekund";
        } else if (interval === 0) {
          return null;
        } else {
          return interval + " sekunder";
        }
      };
    }]);
})();