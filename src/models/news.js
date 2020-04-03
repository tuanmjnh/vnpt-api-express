const Model = require('../utils/tm-oracle');

module.exports = new Model(`${process.env.DB_SCHEMA_TTKD}.ITEMS`, {
  id: { type: Number, key: true, auto: true },
  app_key: String,
  group_id: Number,
  title: String,
  icon: String,
  image: String,
  url: String,
  orders: Number,
  quantity: Number,
  descs: String,
  content: String,
  tags: String,
  attach: String,
  created_by: String,
  created_at: { type: Date, autoDate: true },
  created_ip: String,
  updated_by: String,
  updated_at: { type: Date, autoDate: true },
  updated_ip: String,
  deleted_by: String,
  deleted_at: { type: Date, autoDate: true },
  deleted_ip: String,
  flag: Number
});
