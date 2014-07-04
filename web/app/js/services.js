'use strict';

/* Services */

angular.module('myApp.services', []).


factory("flash", function($rootScope) {
  var queue = [];
  var currentMessage = "";

  $rootScope.$on("$routeChangeSuccess", function() {
    currentMessage = queue.shift() || "";
  });

  return {
    setMessage: function(message) {
      queue.push(message);
    },
    getMessage: function() {
      return currentMessage;
    }
  };
}).


  value('version', '0.1').

  service('EventBus', function() {
    var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
    return eb;
  }).

  service('AnmalanService', ['PersonService', function(personService) {
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
          email: person.email
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
      }

  /*
  {
      titel: 'Försvunnen borrhammare',
      anmalningsstatus: 'SKAPAD',
      ovrigastatusar: '',
      ovrigt: 'övrigt',
      anmalare: {
        firstname: 'Johan',
        lastname: 'Johansson',
        email: 'jj@ncc.se'
      },
      malsagare: {
        organisation: {
          _id: 1,
          namn: 'NCC Construction Sverige AB',
          adress: 'Klubbhusgatan 15',
          postnr: '553 03 Jönköping',
          orgnr: '123456789',
          epost: 'info@ncc.se'
        },
        forsakringsbolag: '',
        forsakringsnummer: ''
      },
      stulnaObjekt: [
        {
          namn: 'Makita borrhammare',
          beskrivning: 'blå å fin',
          typ: 'HKJ2',
          stoldmarkning: 'Nej',
          maskinId: '3287642'
        }
      ],
      tidOchPlats: {
        tid: '',
        tidSenastLamnad: '',
        adress: '',
        postnr: ''
      },
      forlopp: 'Förlopp här',
      loggbok: [
        {
          rubrik: 'Hej',
          meddelande: 'test-meddelande',
          tid: '',
          person: {
            firstname: 'Johan',
            lastname: 'Johansson',
            email: 'jj@ncc.se',
          }
        }
      ],
      handelser: [
        {
          typ: '',
          tid: '',
          person: {
            firstname: 'Johan',
            lastname: 'Johansson',
            email: 'jj@ncc.se'
          }
        }
      ]
    }
  */
      return emptyInstance;
    }


    this.addLogMessage = function(_id, _subject, _body, _user, fnDone) {
      var promise = $.Deferred();
      var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
        eb.onopen = function() {
            eb.send('skapa.loggmeddelande', {id: _id, skapadAv: personService.getUsername(), subject: _subject, body: _body},
            function(reply) {
              if (reply.status == "ok") {
                promise.resolve(reply);
            } else {
              promise.reject(reply);
            }
            });
      };
      return promise;
    };

    this.skickaTillPolisen = function(_id, _title, _user, fnDone) {
      var promise = $.Deferred();
      var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
      eb.onopen = function() {
        eb.send('skicka.till.polisen', {id: _id, skapadAv: personService.getUsername(), title: _title},
        function(reply) {
          if (reply.status == "ok") {
            promise.resolve(reply);
          } else {
            promise.reject(reply);
          }
        });
       };
       return promise;
    };

    this.save = function(_anmalan) {
      var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
      var promise = $.Deferred();
      eb.onopen = function() {
        eb.send('skapa.anmalan', {skapadAv: personService.getUsername(), anmalan: _anmalan},
        function(reply) {
          if (reply.status == "ok") {
            promise.resolve(reply._id);
          } else {
            promise.reject(reply);
          }
          console.log('AnmalanService::save processing reply', reply);
          eb.close();
        });
      };
      return promise;
    };

    this.addFile = function(_id, _file, _user, fnDone) {
      //https://github.com/vert-x/vertx-examples/tree/master/src/raw/java/upload
      //UploadClient
      //console.log('myfile : '+_file);
      console.log('myfile : '+_file.files[0].name);

      var fd = new FormData();
      fd.append("uploadedFile", _file.files[0]);

      //Göra lite snyggare sen
      var uploadComplete = function(evt) {
        console.log(evt.target.responseText);
      };
      var uploadFailed = function(evt) {
        console.log("There was an error attempting to upload the file.");
      };
      var uploadCanceled = function(evt) {
        console.log("The upload has been canceled by the user or the browser dropped the connection.");
      };

      var xhr = new XMLHttpRequest();
      //xhr.upload.addEventListener("progress", _uploadProgress, false);
      xhr.addEventListener("load", uploadComplete, false);
      xhr.addEventListener("error", uploadFailed, false);
      xhr.addEventListener("abort", uploadCanceled, false);
      xhr.open("POST", "http://localhost:8081/form");
      xhr.send(fd);
      console.log('myfile sent!');
    };

    this.findOne = function(id, _user, fnOpen) {
      var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
      eb.onopen = function() {
        eb.send('test.mongodb', {'action': 'find', 'collection': 'anmalningar', matcher: {'_id': id + ""}},
        function(reply) {
          console.log('AnmalanService::findOne processing reply', reply);
          fnOpen.call(this, "ok", reply);
          eb.close();
        });
      };
    };

    this.findAll = function(fn, fnUpdated) {
      var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
      eb.onopen = function() {
        console.log("Buss open");
        eb.send('test.mongodb', {action: 'find', collection: 'anmalningar', matcher: {} },
          function(reply) {
            console.log('AnmalanService::processing reply', reply);
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
      console.log("Events are set up.");
      }
    }]).

    service('PersistentStorage', function($cookieStore) {
      var storage = {};
      storage.set = function(_attr, value) {
        if (value == null) {
          $cookieStore.remove(_attr);
        } else {
          $cookieStore.put(_attr, value);
        }
      };
      storage.get = function(_attr) {
        return $cookieStore.get(_attr);
      };
      return storage;
    }).

    service('TimeDisplayService', [function() {
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
        if (interval == 1) {
          return "en dag";
        } else if (interval > 1) {
          return interval + " dagar";
        }
        interval = Math.floor(seconds / 3600);
        if (interval == 1) {
          return "en timme";
        } else if (interval > 1) {
          return interval + " timmar";
        }
        interval = Math.floor(seconds / 60);
        if (interval == 1) {
          return "en minut";
        } else if (interval > 1) {
          return interval + " minuter";
        }
        var seconds = Math.floor(seconds);
        if (seconds == 1) {
          return "en sekund";
        } else if (seconds == 0) {
          return null;
        } else {
          return seconds + " sekunder";
        }
      }
    }]).

    service('PersonService', ['PersistentStorage', function(persistentStorage) {
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
      this.getOrganisation = function() {
        if (!this.isInitialized()) {
          return null;
        }
        return persistentStorage.get('personAggr').organisation;
      };
      this.kill = function() {
        persistentStorage.get('personAggr', null);
      };
      this.isInitialized = function() {
        return persistentStorage.get('personAggr') != null;
      };
      this.initPersonData = function(_username, eventbus) {
        var personAggregate = {};
        personAggregate['username'] = _username;
        var promise = $.Deferred();
        console.log('PersonService::findPersonData requesting', _username);

        eventbus.send('test.mongodb', {'action': 'find', 'collection': 'users', matcher: {'username': _username}},
          function(reply) {
            console.log('PersonService::findPersonData processing person', reply);
            if (reply.results.length === 1) {
              var organisationId = reply.results[0].organisationId;
              personAggregate['person'] = reply.results[0];
              if (!organisationId)  {
                console.log('PersonService::findPersonData processing organisation', reply);
                promise.reject("Person saknar organisationskoppling");
              } else {

                eventbus.send('test.mongodb', {'action': 'find', 'collection': 'organisations', matcher: {'_id': organisationId}},
                  function(reply) {
                    console.log('PersonService::findPersonData processing organisation', reply);
                    personAggregate['organisation'] = reply.results[0];
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
        }
      }
    ]).
    service('LoginService', ['EventBus', 'PersonService', function(eb, personService) {
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
      }
    }
  ]);
