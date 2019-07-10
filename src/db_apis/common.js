const oracledb = require('oracledb');
const db = require('../services/oracle.js');

module.exports.exist = async function (context) {
  // const sql = `ttkd_bkn.check_exist(:v_table,:v_column,:v_value,:v_condition)`;
  const result = await db.executeCursor('ttkd_bkn.check_exist', context);
  return result;
};

module.exports.getTable = async function (context) {
  const sql = `select ${context.select} from ${context.table} ${context.where ? `where ${context.where}` : ''}`
  const result = await db.execute(sql);
  return result.rows
};

module.exports.getColumn = async function (context) {
  const result = await db.executeCursors('ttkd_bkn.get_column', context);
  return result;
};

// module.exports.getUserFromToken = async function (context) {
//   // context.v_token = { type: oracledb.STRING, dir: oracledb.BIND_IN, val: context.v_token }
//   context.returns = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
//   const result = await db.knex.raw('ttkd_bkn.get_user_from_token(:v_token,:returns)', context).toQuery();
//   // .then((x) => {
//   //   console.log(x);
//   // })
//   const a = db.execute("ttkd_bkn.get_user_from_token('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjA0ODIxMDgsImlzcyI6Imh0dHA6Ly8xMC4xNy4yMC45OSIsImF1ZCI6Imh0dHA6Ly8xMC4xNy4yMC45OSJ9.Q-Ec_WJAKHgdv-6zVTJ8RHjKS9qkcdY5yEJA6-_g6bg',{\"type\":2004,\"dir\":3003})");
//   return result;
// };
