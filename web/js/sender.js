
(function Sender() {

  var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');

  eb.onopen = function() {

    // Get the static data

    eb.send('ping-address', {action: 'test' },
      function(reply) {
        if (reply.status === 'ok') {
          alert(reply.status + "\n" + reply.message);
        } else {
          console.error('Failed to retrieve test msg/reply: ' + reply);
        }
      });
  };

  eb.onclose = function() {
    eb = null;
    console.error('Websocket closing...');
  };

})();