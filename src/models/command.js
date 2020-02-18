const Model = require('../utils/tm-oracle')

module.exports = Model('ttkd_bkn.command', {
  id: { type: String, key: true, auto: true },
  type: String,
  name: String,
  descs: String,
  query: String,
  color: String,
  orders: Number,
  flag: String
})
