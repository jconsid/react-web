'use strict';

/* Services */

angular.module('myApp.services', []).
  value('version', '0.1').

  service('EventBus', function() {
    var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
    return eb;
  }).

  service('AnmalanService', [function() {
    this.addLogMessage = function(_id, _subject, _body, _user, fnDone) {
      var promise = $.Deferred();
      var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
        eb.onopen = function() {
            eb.send('skapa.loggmeddelande', {id: _id, username: _user, subject: _subject, body: _body},
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

    this.save = function(anmalan) {
      var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
      eb.onopen = function() {
        eb.send('test.mongodb', {'action': 'save', 'collection': 'anmalningar', 'document': anmalan},
        function(reply) {
          console.log('AnmalanService::save processing reply', reply);
          eb.close();
        });
      };
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
        eb.send('test.mongodb', {'action': 'find', 'collection': 'anmalningar', matcher: {'_id': id}},
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

    service('global', function($cookieStore, $location, $filter) {
      var globalService = {};
      globalService.user = null;
      globalService.isAuth = function (){
        if (globalService.user == null) {
          globalService.user = $cookieStore.get('user');
        }
        return (globalService.user != null);
      };
      globalService.setUser = function(newUser) {
        globalService.user = newUser;
        if (globalService.user == null)
          $cookieStore.remove('user');
        else
          $cookieStore.put('user', globalService.user);
      };
      globalService.getUser = function() {
        return globalService.user;
      };
      return globalService;
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

    service('LoginService', ['EventBus', function(eb) {
      this.login = function(username, password) {
      var promise = $.Deferred();
      eb.login(username, password,
        function (reply) {
          if (reply.status === 'ok') {
            promise.resolve();
          } else {
            promise.reject();
          }
        });
      return promise;
      }
    }
  ]);
