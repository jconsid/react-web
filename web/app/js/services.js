'use strict';

/* Services */

angular.module('myApp.services', []).
  value('version', '0.1').
  service('EventBus', function() {

	var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');

	return eb;
  }).
  /*service('KnalliTicketService', ['vertxEventBus', function(vertxEventBus) {
		this.findAll = function() {
			console.log("TicketService::findAll");
			vertxEventBus.send('vertx.mongopersistor',
				{action: 'find', collection: 'tickets', matcher: {} }
				, true);.then(function(reply){
	  				console.log('A reply received: ', reply);
				}).catch(function(){
	  				console.warn('No message');
				});
		}

		this.find = function() {
			console.log("find...");
	    	vertxEventBus.send('vertx.mongopersistor',
	    		{action: 'find', collection: 'tickets', matcher: {} },
	    		function(r) {console.log(r)});
		}
  	}
  ]).*/
  service('TicketService', [function() {
  	this.findAll = function(fn) {
  		var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
  		eb.onopen = function() {

	  	    eb.send('vertx.mongopersistor', {action: 'find', collection: 'tickets', matcher: {} },
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
  }]);
