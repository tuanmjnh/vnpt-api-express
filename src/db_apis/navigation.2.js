const oracledb = require('oracledb');
const db = require('../services/oracle.js');
const model = require("../models/navigation");
const helpers = require("../util/helpers");

module.exports.all = async function (context) {
  const result = await db.knex
    .select(model.Context)
    .from(model.Table)
  // .where(model.Context.flag, context.flag);
  return result;
};

module.exports.find = async function (context) {
  const result = await db.knex
    .select(model.Context)
    .from(model.Table)
    .where(model.Key, context.id);
  return result;
};

module.exports.create = async function (context) {
  const result = await db
    .knex(model.Table)
    .insert(helpers.ToUpperCase(context))
    .returning([model.Key, model.Context.created_by, model.Context.created_at]);
  return helpers.ToLowerCase(result[0]);
};

module.exports.update = async function (id, context) {
  const result = await db
    .knex(model.Table)
    .update(helpers.ToUpperCase(context))
    .where(model.Key, id)
    .returning([model.Key, model.Context.updated_by, model.Context.updated_at]);
  return helpers.ToLowerCase(result[0]);
};

module.exports.patch = async function (id, context) {
  const result = await db
    .knex(model.Table)
    .where(model.Key, id)
    .update(helpers.ToUpperCase(context))
    .returning([model.Key, model.Context.deleted_by, model.Context.deleted_at]);
  return helpers.ToLowerCase(result[0]);
};

module.exports.delete = async function (id) {
  const result = await db
    .knex(model.Table)
    .where(model.Key, id)
    .del();
  return result;
};
