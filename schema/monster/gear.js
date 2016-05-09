'use strict';

const Joi = require('joi');


const Crafting = Joi.object().keys({
  crafter: Joi.string().optional(),
  resources: Joi.array().items(Joi.object().keys({
    id: Joi.string().required(),
    amount: Joi.number().integer().required()
  }).label('Resource')).unique().single().sparse().optional()
}).label('Crafting');

const Affinity = Joi.string().only(['red', 'green', 'blue']).label('Affinity');

const Activation = Joi.string().only(['passive', 'movement', 'action', 'both']).label('Activation');

const Modifier = Joi.object().keys({
  stat: Joi.string().required(),
  value: Joi.number().integer().required()
}).label('Modifier');

const Ability = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
  text: Joi.string().required(),
  modifiers: Joi.array().items(),
  activation: Activation.required(),
  affinitiesRequired: Joi.array().items(Joi.object().keys({
    affinity: Affinity.required(),
    adjacent: Joi.boolean().required()
  }).label('Required Affinities')).single().sparse().optional(),
  otherRequirements: Joi.string().optional()
}).label('Ability');

const Gear = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).unique().required(),
  text: Joi.string().required(),
  crafting: Crafting,
  affinities: Joi.object().keys({
    top: Affinity.optional(),
    right: Affinity.optional(),
    down: Affinity.optional(),
    left: Affinity.optional()
  }).label('Affinity Slots').required(),
  abilities: Joi.array().items(Ability).single().sparse().optional()
}).label('Gear');


// gear item
module.exports = {

  crafting: Crafting,
  affinity: Affinity,
  ability: Ability,
  activation: Activation,
  modifier: Modifier,
  gear: Gear

}

