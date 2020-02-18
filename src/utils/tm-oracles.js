function Query() {
  this._select = '';
  this._from = '';
  this._where = '';
  this.select = function(obj) {
    Object.keys(obj).forEach(e => {
      this._select += `${obj[e]} ${e},`;
    });
    return this;
  };
  this.from = function(table) {
    this._from = table
    return this;
  };
  this.where = function(obj) {
    Object.keys(obj).forEach(e => {
      this._where += ``
    });
    return this;
  };
  this.toQuery = function() {
    let rs = `select ${this._select ? this._select : '*'} from ${this._from}`;
    rs += this._where ? ` where ${this._where}` : '';
    return rs;
  }
  return this;
}
module.exports.Query = Query;

module.exports.insert = async function(context) {
  let rs = ''
  Object.keys(context).forEach(e => {

  })
}
