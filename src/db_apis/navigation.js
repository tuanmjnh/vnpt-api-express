const oracledb = require('oracledb');
const db = require('../services/oracle.js');
const model = require("../models/navigation");
const helpers = require("../util/helpers");

const sql_select = `select ID "id",
CODE "code",
DEPENDENT "dependent",
LEVELS "levels",
TITLE "title",
ICON "icon",
IMAGE "image",
URL "url",
URL_PLUS "url_plus",
ORDERS "orders",
DESCS "descs",
CREATED_BY "created_by",
CREATED_AT "created_at",
UPDATED_BY "updated_by",
UPDATED_AT "updated_at",
DELETED_BY "deleted_by",
DELETED_AT "deleted_at",
FLAG "flag",
PUSH "push",
GO "go",
STORE "store",
APP_KEY "app_key"
from ttkd_bkn.navigation`

module.exports.all = async function (binds) {
  const result = await db.execute(sql_select, binds);
  return result.rows;
};

module.exports.find = async function (binds) {
  const sql = sql_select + ` where id=:id`;
  const result = await db.execute(sql, binds);
  return result.rows;
};

module.exports.create = async function (binds) {
  const sql = `insert into ttkd_bkn.navigation(
    code,dependent,levels,title,icon,image,url,url_plus,
    orders,descs,flag,push,go,store,app_key,created_by,created_at) values(
    :code,:dependent,:levels,:title,:icon,:image,:url,:url_plus,
    :orders,:descs,:flag,:push,:go,:store,:app_key,:created_by,sysdate)
    returning id into :id`
  binds.id = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };
  const result = await db.execute(sql, binds);
  if (result.rowsAffected > 0) {
    binds.created_at = new Date()
    binds.id = result.outBinds.id[0]
  } else {
    binds = null
  }
  return binds
};

module.exports.update = async function (binds) {
  const sql = `update ttkd_bkn.navigation set
    dependent=:dependent,levels=:levels,title=:title,icon=:icon,image=:image,
    url=:url,url_plus=:url_plus,orders=:orders,descs=:descs,flag=:flag,
    push=:push,go=:go,store=:store,app_key=:app_key,
    updated_by=:updated_by,updated_at=sysdate
    where id=:id`
  // returning updated_at into :updated_at`
  const result = await db.execute(sql, binds);
  if (result.rowsAffected > 0) {
    binds.updated_at = new Date()
  } else {
    binds = null
  }
  return binds
};

module.exports.patch = async function (binds) {
  // checkAuth
  // query
  const sql = `update ttkd_bkn.navigation set
    flag=:flag,deleted_by=:deleted_by,deleted_at=sysdate
    where id=:id`
  // returning id,flag,deleted_by,deleted_at into :id,:flag,:deleted_by,:deleted_at`;
  // binds
  // binds.id = { type: oracledb.NUMBER, dir: oracledb.BIND_INOUT, val: binds.id };
  // binds.flag = { type: oracledb.NUMBER, dir: oracledb.BIND_INOUT, val: binds.flag };
  // binds.deleted_by = { type: oracledb.STRING, dir: oracledb.BIND_INOUT, val: binds.deleted_by };
  // binds.deleted_at = { type: oracledb.DATE, dir: oracledb.BIND_OUT };
  const result = await db.execute(sql, binds);
  if (result.rowsAffected > 0) {
    binds.deleted_at = new Date()
  } else {
    binds = null
  }
  return binds
};

module.exports.delete = async function (id) {
  const result = await db
    .knex(model.Table)
    .where(model.Key, id)
    .del();
  return result;
};
