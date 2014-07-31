(function () {
  'use strict';
  angular.module('poa.services')
    .service('PersonService', ['PersistentStorage', function(persistentStorage) {
      this.getUsername = function() {
        if (!this.isInitialized()) {
          return null;
        }
        return persistentStorage.get('personAggr').username;
      };
      this.getPerson = function() {
        if (!this.isInitialized()) {
          return null;
        }
        return persistentStorage.get('personAggr').person;
      };
      this.getPersonToAttach = function() {
        if (!this.isInitialized()) {
          return null;
        }
        var p = this.getPerson();
        return {
          firstname: p.firstname,
          lastname: p.lastname,
          email: p.email,
          username: 'admin'
        };
      };
      this.getOrganisation = function() {
        if (!this.isInitialized()) {
          return null;
        }
        return persistentStorage.get('personAggr').organisation;
      };
      this.kill = function() {
        persistentStorage.set('personAggr', null);
      };
      this.isInitialized = function() {
        if (persistentStorage.get('personAggr') === null || persistentStorage.get('personAggr') === undefined) {
          return false;
        } else {
          return true;
        }
      };
      this.initPersonData = function(_username, eventbus) {
        var personAggregate = {};
        personAggregate.username = _username;
        var promise = $.Deferred();
        console.log('PersonService::findPersonData requesting', _username);

        eventbus.send('test.mongodb', {'action': 'find', 'collection': 'users', matcher: {'username': _username}},
          function(reply) {
            console.log('PersonService::findPersonData processing person', reply);
            if (reply.results.length === 1) {
              var organisationId = reply.results[0].organisationId;
              personAggregate.person = reply.results[0];
              delete personAggregate.person.password;
              if (!organisationId)  {
                console.log('PersonService::findPersonData processing organisation', reply);
                promise.reject("Person saknar organisationskoppling");
              } else {

                eventbus.send('test.mongodb', {'action': 'find', 'collection': 'organisations', matcher: {'_id': organisationId}},
                  function(reply) {
                    console.log('PersonService::findPersonData processing organisation', reply);
                    personAggregate.organisation = reply.results[0];
                    persistentStorage.set('personAggr', personAggregate);
                    promise.resolve(personAggregate);
                    eventbus.close();
                  });
              }

            } else {
              promise.reject("Person existerar inte");
            }
          });
          return promise;
        };
      }
    ]);
})();