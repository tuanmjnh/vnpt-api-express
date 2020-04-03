const Model = function(name, schema, options = {}) {
  const keys = Object.keys(schema);
  if (!options.lower) options.lower = true;
  this.name = name;
  this.schema = schema;
  this.options = options;
  // select
  this.select = function(prefix = 'x', join) {
    if (!prefix) prefix = name.toUpperCase();
    let rs = 'SELECT ';
    for (let i = 0; i < keys.length; i++) {
      rs += `${prefix}.${keys[i].toUpperCase()} "${options.lower ? keys[i].toLowerCase() : keys[i]}"`;
      if (i < keys.length - 1) rs += ',';
      rs += '\n';
    }
    rs = `${rs}${join ? ',' + join : ''} FROM ${name.toUpperCase()} ${prefix === name.toUpperCase() ? '' : prefix}`;
    return rs;
  };
  this.insert = function(context) {
    let rs = `INSERT INTO ${name.toUpperCase()}(\n`;
    let value = '';
    let _keys = keys;
    let rerutns = '';
    if (context) _keys = Object.keys(context);
    for (let i = 0; i < _keys.length; i++) {
      if (!schema[_keys[i]]) continue;
      if (schema[_keys[i]].key) {
        rerutns += options.lower
          ? `\nRETURNING ${_keys[i]} INTO :${_keys[i].toLowerCase()}`
          : `\nRETURNING ${_keys[i]} INTO :${_keys[i]}`;
      }
      if (schema[_keys[i]].auto) continue;
      rs += `${_keys[i].toUpperCase()},\n`;
      if (schema[_keys[i]].autoDate) {
        value += 'SYSDATE,\n';
        delete context[_keys[i]];
      } else value += options.lower ? `:${_keys[i].toLowerCase()},\n` : `:${_keys[i]},\n`;
      // console.log(_keys.length)
      // if (i < _keys.length - 1) {
      //   rs += ',\n'
      //   value += ',\n'
      // }
      // rs += '\n'
      // value += '\n'
    }
    rs = `${rs.replace(/,\n$/g, '')}\n)VALUES(\n${value.replace(/,\n$/g, '')})${rerutns}`;
    // console.log(rs)
    // console.log(context)
    return rs;
  };
  this.update = function(context, condition) {
    let rs = `UPDATE ${name.toUpperCase()} SET `;
    let where = ' WHERE ';
    let _keys = keys;
    if (context) _keys = Object.keys(context);
    for (let i = 0; i < _keys.length; i++) {
      if (schema[_keys[i]].key) {
        where += `${_keys[i].toUpperCase()}=:${options.lower ? _keys[i].toLowerCase() : _keys[i]}`;
      } else {
        if (schema[_keys[i]].autoDate) {
          rs += `${_keys[i].toUpperCase()}=SYSDATE`;
          delete context[_keys[i]];
        } else rs += `${_keys[i].toUpperCase()}=:${options.lower ? _keys[i].toLowerCase() : _keys[i]}`;
        if (i < _keys.length - 1) rs += ',';
        rs += '\n';
      }
    }
    rs = rs + where;
    if (condition) {
      rs += ' AND ';
      Object.keys(condition).forEach(e => {
        rs += `${e.toUpperCase()}=:${options.lower ? e.toLowerCase() : e} AND `;
      });
      rs = rs.substr(0, rs.length - 5);
    }
    return rs;
  };
  this.delete = function(context) {
    let rs = `DELETE ${name.toUpperCase()} WHERE `;
    Object.keys(context).forEach(e => {
      rs += `${e.toUpperCase()}=:${options.lower ? e.toLowerCase() : e} AND `;
    });
    rs = rs.substr(0, rs.length - 5);
    return rs;
  };
  this.deleteAll = function() {
    let rs = `DELETE ${name.toUpperCase()}`;
    return rs;
  };
  return this;
};

module.exports = Model;
