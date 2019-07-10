const moment = require('moment')

function getBody(obj, req) { // req: Request
  const rs = {};
  Object.keys(obj).forEach(e => {
    if (req.body && req.body[e] !== undefined) rs[e] = req.body[e];
  });
  return rs;
};
module.exports.body = getBody;

function toTimestamp(strDate) {
  let datum = Date.parse(strDate);
  return datum / 1000;
}
module.exports.toTimestamp = toTimestamp;

function ToUpperCase(obj) {
  let rs = {}
  Object.keys(obj).forEach(e => {
    rs[e.toUpperCase()] = obj[e]
  });
  return rs;
}
module.exports.ToUpperCase = ToUpperCase;

function ToLowerCase(obj) {
  let rs = {}
  Object.keys(obj).forEach(e => {
    rs[e.toLowerCase()] = obj[e]
  });
  return rs;
}
module.exports.ToLowerCase = ToLowerCase;

module.exports.RandomDate = function(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

module.exports.NewGuid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  );
}

module.exports.ToDate = function(timestamp, format = null) {
  timestamp = parseInt(timestamp);
  if (format) {
    return moment(timestamp).format(format);
  } else {
    return moment(timestamp).toDate();
  }
}
