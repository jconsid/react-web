var vertx = require('vertx');

var container = require('vertx/container');

var appConfig = container.config;

container.deployVerticle('se.consid.poa.SkapaLoggmeddelande', appConfig.skapaLoggmeddelande);
container.deployVerticle('se.consid.poa.SkickaTillPolisen', appConfig.skickaTillPolisen);

//container.deployVerticle('se.consid.reactive.ListenerTwo', appConfig.verticle2Config);
//container.deployVerticle('se.consid.reactive.ListenerThree', appConfig.verticle3Config);
//container.deployVerticle('hello.js', appConfig.hello);



