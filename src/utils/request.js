module.exports.getIp = request => {
  // const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  // console.log(req.connection.remoteAddress)
  // console.log(req.connection.remotePort)
  // console.log(req.connection.localAddress)
  // console.log(req.connection.localPort)
  const ip = request.ip;
  if (ip === '::1') return '127.0.0.1';
  return ip;
};

module.exports.getHost = request => {
  if (request) return `${request.protocol}://${request.get('host')}`;
  return 'http://127.0.0.1/';
};

module.exports.getHostUrl = request => {
  if (request) return `${request.protocol}://${request.get('host')}${request.originalUrl}`;
  return 'http://127.0.0.1/';
};

module.exports.getUserAgent = request => {
  if (request) return request.headers['user-agent'];
  else return 'undefined';
};
