module.exports.Table = 'TTKD_BKN.NAVIGATION'
module.exports.Key = 'ID'
module.exports.Context = {
  id: "ID",
  code: "CODE",
  dependent: "DEPENDENT",
  levels: "LEVELS",
  title: "TITLE",
  icon: "ICON",
  image: "IMAGE",
  url: "URL",
  url_plus: "URL_PLUS",
  orders: "ORDERS",
  descs: "DESCS",
  created_by: "CREATED_BY",
  created_at: "CREATED_AT",
  updated_by: "UPDATED_BY",
  updated_at: "UPDATED_AT",
  deleted_by: "DELETED_BY",
  deleted_at: "DELETED_AT",
  flag: "FLAG",
  push: "PUSH",
  go: "GO",
  store: "STORE",
  app_key: "APP_KEY"
};

module.exports.getContext = function (req) {
  return {
    app_key: req.body.app_key,
    dependent: req.body.dependent,
    levels: req.body.levels,
    title: req.body.title,
    icon: req.body.icon,
    image: req.body.image,
    url: req.body.url,
    url_plus: req.body.url_plus,
    orders: req.body.orders,
    descs: req.body.descs,
    flag: req.body.flag,
    push: req.body.push,
    go: req.body.go,
    store: req.body.store
  }
};
