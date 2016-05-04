'use strict';

module.exports = (server) => {

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'web',
        listing: false
      }
    }
  });
  
  server.route({
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        reply().redirect('/index.html');
      }
  });

}
