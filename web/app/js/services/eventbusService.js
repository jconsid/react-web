(function () {
	'use strict';
	angular.module('poa.services')
	  .service('EventBusService', function() {
	  	var getEb = function() {
	  		return new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
	  	}
	  	var TIMEOUT_MS = 5000;
	  	this.send = function(busAdress, payload) {
	  		var promise = $.Deferred();
			var eventbus = getEb();
			var isOpen = false;
			var isReplied = false;

		    var timeoutGuard = setTimeout(function() {
		      		if (!isOpen) {
						promise.reject("Applikationen misslyckades med att öppna meddelandekanal inom " + (TIMEOUT_MS/1000) + " s.");
		      		} else if (!isReplied) {
						promise.reject("Applikationen svarade inte inom " + (TIMEOUT_MS/1000) + " s. Vänligen, försök igen.");
		      		}
		    	},
		    	TIMEOUT_MS
	    	);

			eventbus.onopen = function() {
				isOpen = true;
				eventbus.send(busAdress, payload, function(reply) {
				  clearTimeout(timeoutGuard);
				  isReplied = true;
		          if (reply.status === "ok") {
		            promise.resolve(reply);
		          } else {
		            promise.reject(reply);
		          }
				});
			}
			return promise;
	  	}
	  });
})();



/*

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

*/