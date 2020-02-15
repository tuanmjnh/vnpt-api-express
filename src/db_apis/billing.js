const db = require('../services/oracle.js')

module.exports.getKyCuoc = async function(context, order) {
  let sql = `SELECT KYHOADON_ID "value",KYHOADON "label" FROM TTKD_BKN.BC_KYHOADON`
  const rs = await db.execute(sql)
  return rs.rows
}
