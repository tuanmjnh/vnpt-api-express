const oracledb = require('oracledb');
const db = require('../services/oracle.js');
const model = require("../models/test");
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
  context[model.Key] = { dir: oracledb.BIND_OUT, type: oracledb.STRING };
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
  context.updated_by = { dir: oracledb.BIND_OUT, type: oracledb.STRING };
  context.updated_at = { dir: oracledb.BIND_OUT, type: oracledb.DATE };
  // build query
  const sql = tmdb.update(model.Table, context, { id: context.id }, {
    updated_by: `(select ma_nd from admin_bkn.nguoidung where nguoidung_id=${updated_by})`,
    updated_at: 'SYSDATE'
  });
  // execute query
  const result = await db.execute(sql, context);
  console.log(result);
  // get outBinds
  context.updated_by = result.outBinds.updated_by[0];
  context.updated_at = result.outBinds.updated_at[0];
  // return result
  if (result.rowsAffected && result.rowsAffected === 1) return context;
  else return null;
};

module.exports.updateFlag = async function (context, deleted_by) {
  // build query
  const sql = tmdb.update(model.Table, context[0], { id: '' }, {
    updated_by: `(select ma_nd from admin_bkn.nguoidung where nguoidung_id=${deleted_by})`,
    updated_at: 'SYSDATE'
  });
  // let sql = `UPDATE ttkd_bkn.test SET
  // flag=:flag,
  // deleted_by=(select ma_nd from admin_bkn.nguoidung where nguoidung_id=${deleted_by}),
  // deleted_at=SYSDATE
  // WHERE id=:id`;
  // RETURNING deleted_by,deleted_at INTO :deleted_by,:deleted_at`
  // execute query
  // const opts = {
  //   bindDefs: {
  //     id: { type: oracledb.STRING, maxSize: 36 },
  //     flag: { type: oracledb.NUMBER },
  //     deleted_by: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
  //     deleted_at: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
  //     // { dir: oracledb.BIND_OUT, type: oracledb.DATE }
  //   }
  // }
  const result = await db.executeMany(sql, context);
  // return result
  if (result.rowsAffected && result.rowsAffected > 0) return result.rowsAffected;
  else return null;
};

module.exports.delete = async function (context) {
  // build query
  const sql = tmdb.delete(model.Table, { id: '' });
  // execute query
  const result = await db.executeMany(sql, context);
  // return result
  if (result.rowsAffected && result.rowsAffected > 0) return result.rowsAffected;
  else return null;
};
