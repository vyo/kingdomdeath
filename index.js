'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');

const Promise = require('bluebird');


const Server = new Hapi.Server();
Server.connection( {
  port: process.env['PORT'] || 8000
});


const initServer = () => {

  return new Promise ( ( resolveInitServer, rejectInitServer ) => {
    let plugins = [
      Inert,
      Vision
    ];

    Server.register(plugins, (err) => {
      if (err) {
        throw err;
      }

      Server.start( (err) => {

        if (err) {
          throw err;
        }

        resolveInitServer(Server);
      });

    });

  })
  .then( () => {
    Server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: 'web',
          listing: false
        }
      }
    });
  })
  .then( () => {
    return Server;
  });
}

if ( !module.parent ) {
  initServer().then( (res) => {
    console.log('Server running at: ' + Server.info.uri);
  });
}

module.exports = initServer;
