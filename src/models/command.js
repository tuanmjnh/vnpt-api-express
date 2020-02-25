const Model = require('../utils/tm-oracle')

module.exports = new Model(`${process.env.DB_SCHEMA_TTKD}.command`, {
  id: { type: String, key: true, auto: true },
  type: String,
  name: String,
  descs: String,
  query: String,
  color: String,
  orders: Number,
  flag: String
})
