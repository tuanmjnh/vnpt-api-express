const oracledb = require('oracledb');
const db = require('../services/oracle.js');
const model = require("../models/navigation");
const tmdb = require("../util/tm-db");

module.exports.all = async function (context) {
  const result = await db.execute(tmdb.find(model.Table, model.Context, context), context);
  return result.rows;
};

module.exports.find = async function (context) {
  const result = await db.execute(tmdb.find(model.Table, model.Context, context), context);
  return result.rows;
};

module.exports.create = async function (context) {
  // get created_by
  const created_by = context.created_by;
  // declare outBinds
  context[model.Key] = { dir: oracledb.BIND_OUT, type: oracledb.NUMBER };
  context.created_by = { dir: oracledb.BIND_OUT, type: oracledb.STRING };
  context.created_at = { dir: oracledb.BIND_OUT, type: oracledb.DATE };
  // build query
  const sql = tmdb.insert(model.Table, context, {
    created_by: `(select ma_nd from admin_bkn.nguoidung where nguoidung_id=${created_by})`,
    created_at: 'SYSDATE'
  });
  // execute query
  const result = await db.execute(sql, context);
  // get outBinds
  context[model.Key] = result.outBinds[model.Key][0];
  context.created_by = result.outBinds.created_by[0];
  context.created_at = result.outBinds.created_at[0];
  // return result
  if (result.rowsAffected) return context
  else return null
};

module.exports.update = async function (context) {
  // get updated_by
  const updated_by = context.updated_by;
  // declare outBinds
  context[model.Key] = { dir: oracledb.BIND_OUT, type: oracledb.NUMBER };
  context.updated_by = { dir: oracledb.BIND_OUT, type: oracledb.STRING };
  context.updated_at = { dir: oracledb.BIND_OUT, type: oracledb.DATE };
  // build query
  const sql = tmdb.update(model.Table, context, {
    updated_by: `(select ma_nd from admin_bkn.nguoidung where nguoidung_id=${updated_by})`,
    updated_at: 'SYSDATE'
  });
  console.log(sql);
  // execute query
  const result = await db.execute(sql, context);
  // get outBinds
  context[model.Key] = result.outBinds[model.Key][0];
  context.updated_by = result.outBinds.updated_by[0];
  context.updated_at = result.outBinds.createupdated_atd_at[0];
  // return result
  if (result.rowsAffected) return context;
  else return null;
};
