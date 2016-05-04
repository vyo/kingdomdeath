'use strict';

const Promise = require('bluebird');

const Bunyan = require('bunyan');

const Hapi = require('hapi');

const Loki = require('lokijs');
const DB = new Loki('kingdomdeath.db');

const Log = Bunyan.createLogger({ name: 'kingdomdeath', level: process.env['LOG_LEVEL'] || 'debug' });

const Server = new Hapi.Server();
Server.connection( {
  port: process.env['PORT'] || 8000
});

const PleaseRegister = Promise.promisify(Server.register);
const PleaseStart = Promise.promisify(Server.start);

const Register = (plugins) => {
  return PleaseRegister.call(Server, plugins);
};
const Route = (routes) => {
  return Promise.resolve(routes(Server));
};
const Start = () => {
  return PleaseStart.call(Server);
};

//plugins
const Inert = require('inert');
const Vision = require('vision');
const HapiBunyan = {
  register: require('hapi-bunyan'),
  options: {
    logger: Log
  }
};

// routes
const Web = require('./route/web');


// fire it up
() => {
  return Register( [Inert, Vision, HapiBunyan] )
    .then( Route(Web) )
    .then( Start() )
    .then( () => {
      Server.log('info', 'Running at ' + Server.info.uri)
      return Server;
    })
    .catch( (err) => {
      Server.log('error', err);
    });
}();


