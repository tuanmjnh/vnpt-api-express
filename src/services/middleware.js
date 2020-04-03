const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports.sign = (params, secret) => {
  // expires in 24 hours
  secret = secret || process.env.SECRET;
  return jwt.sign(params, secret, { expiresIn: '24h' });
};

module.exports.login = (req, res, next) => {
  try {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (!token) return res.status(401).json({ msg: 'no_exist_token' });
    // Remove Bearer from string
    if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
    const decoded = jwt.verify(token, process.env.SECRET);
    return { ...decoded, ...{ token: token, secret: process.env.SECRET } };
  } catch (err) {
    res.status(402).json({ msg: 'invalid_token' });
    return null;
  }
};

// module.exports.verify = (req, res, secret) => {
//   try {
//     secret = secret || process.env.SECRET
//     let token = req.headers['x-access-token'] || req.headers['authorization'] // Express headers are auto converted to lowercase
//     if (!token) {
//       res.status(401).json({ msg: 'no_exist_token' })
//       return null
//     }
//     // Remove Bearer from string
//     if (token.startsWith('Bearer ')) token = token.slice(7, token.length)
//     // cert
//     // var cert = fs.readFileSync('public.pem') // get public key
//     // console.log(cert)
//     // verify token
//     // return jwt.verify(token, SECRET, (e, decoded) => {
//     //   if (e) return res.status(402).json({ msg: 'invalid_token' })
//     // })
//     return { ...jwt.verify(token, secret), ...{ token: token, secret: secret } }
//   } catch (e) {
//     res.status(402).json({ msg: 'invalid_token' })
//     return null
//   }
// }

module.exports.verify = (req, res, next) => {
  try {
    if (
      (req.path === process.env.BASE_URL && req.method.toUpperCase() === 'GET') ||
      (req.path === `${process.env.BASE_URL}api/auth` && req.method.toUpperCase() === 'POST')
    ) {
      next();
      return null;
    }
    const secret = process.env.SECRET;
    let token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
    if (!token) {
      res.status(401).json({ msg: 'no_exist_token' });
      return;
    }
    // Remove Bearer from string
    if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
    req.verify = { ...jwt.verify(token, secret), ...{ token, secret } };
    next();
  } catch (e) {
    res.status(402).json({ msg: 'invalid_token' });
    return null;
  }
};
