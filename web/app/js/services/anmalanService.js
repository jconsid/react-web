(function () {
  'use strict';
angular.module('myApp.services')
  .service('AnmalanService', ['PersonService', function(personService) {
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
      var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
        eb.onopen = function() {
            eb.send('skapa.loggmeddelande', {id: _id, skapadAv: personService.getPersonToAttach(), subject: _subject, body: _body},
            function(reply) {
              if (reply.status === "ok") {
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
          if (reply.status === "ok") {
            promise.resolve(reply);
          } else {
            promise.reject(reply);
          }
        });
       };
       return promise;
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
      var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
      var promise = $.Deferred();
      eb.onopen = function() {
        var payloadJson = {skapadAv: inloggadPerson, anmalan: _anmalan};
        eb.send('skapa.anmalan', payloadJson,
        function(reply) {
          if (reply.status === "ok") {
            console.log("SAVE OK");
            promise.resolve(reply._id);
          } else {
            console.log("save nok");
            promise.reject(reply);
          }
          console.log('AnmalanService::save processing reply', reply);
          eb.close();
        });
      };
      return promise;
    };

    /*this.addFile = function(_id, _file, _user, fnDone) {
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
    };*/

    this.findOne = function(id, fnOpen) {
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
      console.log("Events are set up.");
    };
  }]);
})();
