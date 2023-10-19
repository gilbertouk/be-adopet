import jwt from 'jsonwebtoken';

async function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '1h',
      issuer: 'adopet.com',
      audience: `${userId}`,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        return reject(err);
      }
      return resolve(token);
    });
  });
}

async function verifyAccessToken(req, res, next) {
  if (!req.headers['authorization']) {
    const objErr = { status: 401, message: 'unauthorized user' };
    return next(objErr);
  }

  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const objErr = { status: 401, message: 'unauthorized user' };
      next(objErr);
      return next(objErr);
    }
    req.payload = payload;
    next();
  });
}

export { signAccessToken, verifyAccessToken };
