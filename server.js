'use strict';

const Promise = require('bluebird');

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');

const Loki = require('lokijs');
const DB = new Loki('kingdomdeath.db');


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


const Web = require('./route/web');


// fire it up
() => {
  return Register( [Inert, Vision] )
    .then( Route(Web) )
    .then( Start() )
    .then( () => {
      console.log('Running at ' + Server.info.uri)
      return Server;
    })
    .catch( (err) => {
      console.log(err)
    });
}();


