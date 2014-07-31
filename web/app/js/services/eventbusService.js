(function () {
  'use strict';
angular.module('myApp.services')
  .service('EventBus', function() {
    var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
    return eb;
  });
})();