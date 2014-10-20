(function () {
  'use strict';
  angular.module('poa.services').
    service('LoginService', ['vertxEventBus', 'PersonService', function(eb, personService) {
      this.login = function(username, password) {
        var promise = $.Deferred();
        eb.login(username, password,
          function (reply) {
            if (reply.status === 'ok') {
              $.when(
                personService.initPersonData(username, eb)
              ).done(
                function(personAggregate) {
                  promise.resolve(personAggregate);
                }
              ).fail(
                function(msg) {
                  promise.reject(msg);
                }
              );
            } else {
              promise.reject("Ogiltigt användarnamn eller lösenord");
            }
          });
        return promise;
      };
    }
  ]);
})();