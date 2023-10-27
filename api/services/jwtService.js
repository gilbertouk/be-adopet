import jwt from 'jsonwebtoken';
import client from '../helpers/redisHelper.js';

async function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '1h',
      issuer: process.env.TOKEN_ISSUER,
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
  if (!req.headers.authorization) {
    const objErr = { status: 401, message: 'unauthorized' };
    return next(objErr);
  }

  const authHeader = req.headers.authorization;
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];

  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        const objErr = { status: 401, message: 'unauthorized' };
        return next(objErr);
      }

      const objErr = { status: 401, message: err.message };
      return next(objErr);
    }

    req.payload = payload;
    return next();
  });
}

async function signRefreshToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: '1y',
      issuer: process.env.TOKEN_ISSUER,
      audience: `${userId}`,
    };

    jwt.sign(payload, secret, options, async (err, token) => {
      if (err) {
        return reject(err);
      }

      await client.SET(
        `${userId}`,
        token,
        { EX: 365 * 24 * 60 * 60 },
        (err, reply) => {
          if (err) {
            console.log(err.message);
            reject(err.message);
          }
        },
      );

      return resolve(token);
    });
  });
}

async function verifyRefreshToken(refreshToken) {
  if (!refreshToken) {
    const objErr = { status: 400, message: 'bad request' };
    throw objErr;
  }

  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        if (err) {
          const objErr = { status: 401, message: 'unauthorized' };
          return reject(objErr);
        }

        const userId = payload.aud;
        const result = await client.get(userId);

        if (!result) {
          return reject(err);
        }

        if (refreshToken === result) {
          return resolve(userId);
        }

        const objErr = { status: 401, message: 'unauthorized' };
        return reject(objErr);
      },
    );
  });
}

async function removeRefreshToken(userId) {
  console.log(userId);
  return client.DEL(userId, (err, result) => {
    if (err) {
      console.log(err.message);
      throw err;
    }
    console.log(result);
    return result;
  });
}

export {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  removeRefreshToken,
};
