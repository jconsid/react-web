(function () {
  'use strict';
angular.module('poa.services')
  .service('AnmalanService', ['PersonService', 'EventBusService', function(personService, eb) {
    this.newAnmalanInstance = function(person, _organisation) {
      var emptyInstance = {
        titel: '',
        anmalningsstatus: 'NY',
        ovrigastatusar: null,
        ovrigt: null,
        forlopp: null,
        anmalare: {
          firstname: person.firstname,
          lastname: person.lastname,
          email: person.email,
          username: person.username
        },
        malsagare: {
          organisation: {
            _id: _organisation._id,
            namn: _organisation.namn,
            adress: _organisation.adress,
            postnr: _organisation.postnr,
            orgnr: _organisation.orgnr,
            epost: _organisation.epost
          },
          forsakringsbolag: null,
          forsakringsnummer: null
        },
        stulnaObjekt: [],
        tidOchPlats: {
          tid: null,
          tidSenastLamnad: null,
          adress: null,
          postnr: null
        },
        loggbok: [],
        handelser: []
      };
      return emptyInstance;
    };


    this.addLogMessage = function(_id, _subject, _body, _user, fnDone) {
      var promise = $.Deferred();
      $.when(eb.send('skapa.loggmeddelande',
              {id: _id, skapadAv: personService.getPersonToAttach(), subject: _subject, body: _body})
      ).done(function(r) {
          promise.resolve(r);
      }).fail(function(r) {
          promise.reject(r);
      });
      return promise;
    };

    this.skickaTillPolisen = function(_id, _title, _user, fnDone) {
      var q = $.Deferred();

      $.when(
        eb.send('skicka.till.polisen', {id: _id, skapadAv: personService.getUsername(), title: _title})
      ).done(function(r) {
        q.resolve(r);
      }).fail(function(r) {
        q.reject(r);
      });
       return q;
    };

    this.fabricateHandelse = function(_typ, _person) {
      return {
        typ: _typ,
        tid: (new Date()).getTime(),
        person: {
          firstname: _person.firstname,
          lastname: _person.lastname,
          email: _person.email
        }
      };
    };
    this.create = function(_anmalan) {
      _anmalan.anmalningsstatus = "SKAPAD";
      // _anmalan.handelser.push(this.fabricateHandelse('Anmälan skapad', personService.getPersonToAttach()));
      return this.save(_anmalan);
    };

    this.save = function(_anmalan) {
      var inloggadPerson = personService.getPersonToAttach();
      var q = $.Deferred();
      var payloadJson = {skapadAv: inloggadPerson, anmalan: _anmalan};
      $.when(
        eb.send('skapa.anmalan', payloadJson)
      ).done(function(r) {
        q.resolve(r);
      }).fail(function(r) {
        q.reject(r);
      });
      return q;
    };

    this.findOne = function(id, fnOpen, fnUpdated) {
      $.when(
        eb.send('test.mongodb',
          {'action': 'find', 'collection': 'anmalningar', matcher: {'_id': id + ""}})
      ).done(function(reply) {
          console.log('AnmalanService::findOne processing reply', reply);
          fnOpen.call(this, "ok", reply);
      }).fail(
          function(reply) {
              alert("Failure " + reply);
          }
      );
      if (fnUpdated) {
        var ebx = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
        ebx.onopen = function() {
          ebx.registerHandler('anmalan.uppdaterad',
            function(updatedEvent) {
              console.log('AnmalanService::findOne anmalan.uppdaterad', updatedEvent);
              fnUpdated.call(this, updatedEvent); 
            }
          );
        };
      }
    };

    this.findAll = function(fn, fnUpdated) {
      var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
      eb.onopen = function() {
        eb.send('test.mongodb', {action: 'find', collection: 'anmalningar', matcher: {} },
          function(reply) {
            if (reply.status === 'ok') {
              var anmalanArray = [];
              for (var i = 0; i < reply.results.length; i++) {
                anmalanArray[i] = reply.results[i];
              }
              fn.call(this, "ok", anmalanArray);
            } else {
              console.error('Failed to retrieve tickets: ' + reply.message);
              fn.call("error", null);
            }
          }
        );
        eb.registerHandler('anmalan.uppdaterad',
          function(updatedEvent) {
            console.log('AnmalanService::findAll anmalan.uppdaterad', updatedEvent);
            fnUpdated.call(this, "ok", updatedEvent); 
          }
        );
      };
    };
  }]);
})();
