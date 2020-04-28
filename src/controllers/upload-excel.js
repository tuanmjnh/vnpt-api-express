const oracle = require('oracledb'),
  db = require('../services/oracle.js');

const sqlCreateTable = `declare
  begin
    execute immediate 'CREATE TABLE UPLOADEXCEL(
      ID VARCHAR2(32 BYTE) DEFAULT SYS_GUID(),
      NAME VARCHAR2(128 BYTE),
      ORDERS NUMBER,
      CREATED_AT DATE DEFAULT SYSDATE
    )';
    exception when others then
      if SQLCODE = -955 then null; else raise; end if;
  end`;
const sqlInsert = `
INSERT INTO UPLOADEXCEL(NAME,ORDERS) VALUES(:name,:orders)
returning id into :id
`;
module.exports.insert = async function (req, res, next) {
  try {
    if (!req.body || !req.body.length) {
      return res.status(500).send('invalid');
    }
    const rs = [];
    for await (const e of req.body) {
      const item = {
        id: { type: oracle.DB_TYPE_NVARCHAR, dir: oracle.BIND_OUT },
        name: e.name,
        orders: e.orders,
      };
      const _rs = await db.execute(sqlInsert, item);
      if (_rs.outBinds.id.length > 0) {
        item.id = _rs.outBinds.id[0];
        rs.push(item);
      }
    }
    if (rs.length) {
      return res.status(203).json(rs).end();
    }
    return res.status(200).json([]).end();
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};
