'use strict';

/* Services */

angular.module('myApp.services', []).
  value('version', '0.1').
  service('EventBus', function() {

	var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');

	return eb;
  }).
  service('ReceiverSampleService', [function() {
  	this.ping = function(fn) {
  		var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');

  		eb.onopen = function() {
	  	    eb.send('ping-address', {action: 'ping' },
		      function(reply) {
		        if (reply.results === 'ok') {
		          fn.call(this, null, reply.results);
		        } else {
		          console.error('Failed to retrieve ping response: ' + reply.message);
		          fn.call("error", null);
		        }
		        eb.close();
		      });
		};
  	}
  }]).

  service('TicketService', [function() {

	this.addLogMessage = function(_id, _subject, _body, _user, fnDone) {
		var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
  		eb.onopen = function() {

	  	    eb.send('arende.skapalog', {id: _id, username: _user, subject: _subject, body: _body},
		      function(reply) {
		      	console.log('TicketService::addLogMessage processing reply', reply);
		      	fnDone.call(this, "ok", reply);
		      });
		};
	};

	this.findOne = function(id, fnOpen, fnOpenedByUser, fnLogCreated) {
		var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
		console.log("Öppnar buss...");
  		eb.onopen = function() {
			console.log("Buss öppen!");

	  	    eb.send('arende.oppna', {id: id},
		      function(reply) {
		      	console.log('TicketService::findOne processing reply', reply);
		      	fnOpen.call(this, "ok", reply);
		        /*if (reply.status === 'ok') {
		          var ticketArray = [];
		          for (var i = 0; i < reply.results.length; i++) {
		            ticketArray[i] = reply.results[i];
		          }
		          fnOpen.call(this, "ok", ticketArray);
		        } else {
		          console.error('Failed to retrieve tickets: ' + reply.message);
		          fnOpen.call("error", null);
		        }*/
		      });


	  	    eb.registerHandler('arende.oppnat',
		      function(reply) {
		      	console.log('TicketService::findOne arende.oppnat reply', reply);
		      	fnOpenedByUser.call(this, "ok", reply);
		      });

			eb.registerHandler('arende.logskapad',
		      function(reply) {
		      	console.log('TicketService::findOne arende.logskapad reply', reply);
		      	fnLogCreated.call(this, "ok", reply);
		      });

	  	    
		};
	};


  	this.findAll = function(fn) {
  		var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
  		eb.onopen = function() {

	  	    eb.send('test.mongodb', {action: 'find', collection: 'anmalningar', matcher: {} },
		      function(reply) {
		      	console.log('TicketService::processing reply', reply);
		        if (reply.status === 'ok') {
		          var ticketArray = [];
		          for (var i = 0; i < reply.results.length; i++) {
		            ticketArray[i] = reply.results[i];
		          }
		          fn.call(this, "ok", ticketArray);
		        } else {
		          console.error('Failed to retrieve tickets: ' + reply.message);
		          fn.call("error", null);
		        }
		      });
		};
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

  service('LoginService', ['EventBus', function(eb) {
  	this.login = function(username, password, fn) {
      	eb.login(username, password,
      		function (reply) {
		    	if (reply.status === 'ok') {
					fn.call(null, "ok");
		    	} else {
		    		console.log("Login failed for: " + username);
		    		fn.call(reply.status, "failure");
				}
		});
  	}
  }]).
  service('SearchLogService', ['EventBus', function(eb){
    this.sendSearchLog = function(searchString){
    		var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
    		eb.onopen = function() {
  	            eb.send('Consid.SearchLog', "{'search': '" + searchString +"'}",null);
  }}}])
  ;
