(function () {
  'use strict';
angular.module('myApp.services')
  .service('PersistentStorage', ['$cookieStore', function(c) {
      var storage = {};
      storage.set = function(_attr, value) {
        if (value === null) {
          c.remove(_attr);
        } else {
          c.put(_attr, value);
        }
      };
      storage.get = function(_attr) {
        return c.get(_attr);
      };
      return storage;
    }]);
})();
