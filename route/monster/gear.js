'use strict';

const Boom = require('boom');
const Joi = require('joi');


module.exports = (server) => {

  let Gear = require(server.methods.path.schema('monster/gear')).gear;

  server.route({
    method: 'GET',
    path: '/monster/gear/{id}',
    config: {
      tags: ['api', 'monster', 'gear'],
      handler: (request, reply) => {
        reply();
      },
      response: {
        schema: Gear
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/monster/gear',
    config: {
      tags: ['api', 'admin', 'monster', 'gear'],
      handler: (request, reply) => {
        reply();
      },
      validate: {
        payload: Gear
      }
    }
  });

};

