/*require('vertx.js');
var container = require('vertx/container');

var webServerConf = {  
  port: 8080,
  host: 'localhost'
};

// Start the web server, with the config we defined above
container.deployModule('io.vertx~mod-web-server~2.0.0-final', webServerConf);*/

/*
This verticle contains the configuration for our application and co-ordinates
start-up of the verticles that make up the application.
 */

var container = require('vertx/container');

var console = require('vertx/console');

// Our application config - you can maintain it here or alternatively you could
// stick it in a conf.json text file and specify that on the command line when
// starting this verticle

// Configuration for the web server
var webServerConf = {

  // Normal web server stuff

  port: 8080,
  // host: '192.168.5.187',
  host: 'localhost',

  // Configuration for the event bus client side bridge
  // This bridges messages from the client side to the server side event bus
  bridge: true,

  // This defines which messages from the client we will let through
  // to the server side
  inbound_permitted: [
    // Allow calls to login and authorise
    {
      address: 'skapa.loggmeddelande'
    },
    {
      address: 'skicka.till.polisen'
    },
    {
      address: 'skicka.till.polisen.epost'
    },
    {
      address: 'anmalan.uppdaterad'
    },
    {
      address: 'skapa.anmalan'
    },
    {
      address: 'vertx.basicauthmanager.login'
    },
    // Tillåt meddelanden för att komma åt anmalningar
    {
      address : 'test.mongodb',
      match : {
        action : 'find',
        collection : 'users'
      }
    },
    {
      address : 'test.mongodb',
      match : {
        action : 'find',
        collection : 'organisations'
      }
    },
    {
      address : 'test.mongodb',
      match : {
        action : 'save',
        collection : 'anmalningar'
      }
    },
    {
      address : 'test.mongodb',
      match : {
        action : 'find',
        collection : 'anmalningar'
      }
    }
  ],

  // This defines which messages from the server we will let through to the client
  outbound_permitted: [
    {}
  ]
};

// Now we deploy the modules that we need

// Deploy a MongoDB persistor module
var mongoConf = {

    "address": "test.mongodb"

}
container.deployModule('io.vertx~mod-mongo-persistor~2.1.0', mongoConf, function(err, deployID) {

  // And when it's deployed run a script to load it with some reference
  // data for the demo
  if (!err) {
    load('import.js');
  } else {
    err.printStackTrace();
  }
});

// Deploy an auth manager to handle the authentication

container.deployModule('io.vertx~mod-auth-mgr~2.0.0-final', {"persistor_address": "test.mongodb"});

// Start the web server, with the config we defined above

container.deployModule('io.vertx~mod-web-server~2.0.0-final', webServerConf);

var config = container.config;

// https://github.com/vert-x/mod-mailer
container.deployModule('io.vertx~mod-mailer~2.0.0-final', config.mailerConf);

container.deployModule('se.consid.poa~anmalan~0.1', config.poaConf);
// container.deployModule('com.consid.react~reactive-module~0.1');
// container.deployModule('se.consid.reactive~OppnaAnmalan~0.1');
// container.deployModule('se.consid.reactive~SearchLogger~0.1');



