const db = require("../services/oracle");
const model = require("../models/test");
const helpers = require("../util/helpers");

module.exports.all = async function(context) {
  const result = db.knex
    // .withSchema('TTKD_BKN')
    .select(model.Context) // { id: 'ID' }, { name: 'NAME' }
    .from(model.Table);
  return result;
};

module.exports.find = async function(context) {
  const result = db.knex
    .select(model.Context)
    .from(model.Table)
    .where(model.Context.id, context.id);
  return result;
};

module.exports.create = async function(context) {
  const result = db
    .knex(model.Table)
    .insert(helpers.ToUpperCase(context))
    .returning([model.Key, model.Context.created_by, model.Context.created_at]); // .toSQL()
  return result;
};

module.exports.update = async function(id, context) {
  const result = db
    .knex(model.Table)
    .update(helpers.ToUpperCase(context))
    .where(model.Key, id)
    .returning([model.Key, model.Context.updated_by, model.Context.updated_at]); // .toSQL()
  return result;
};

module.exports.patch = async function(id, context) {
  const result = await db
    .knex(model.Table)
    .where(model.Key, id)
    .update(helpers.ToUpperCase(context));
  return result;
};

// module.exports.updateFlag = async function (context) {
//   let result = 0;
//   for await (const e of context) {
//     await db.knex(model.Table)
//       .where(model.Key, '=', e.id)
//       .update(helpers.ToUpperCase(e))
//       .then((x) => { result += x });
//   }
//   return result;
// };

module.exports.delete = async function(id) {
  const result = await db
    .knex(model.Table)
    .where(model.Key, "=", id)
    .del();
  return result;
};
