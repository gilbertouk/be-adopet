import jwt from 'jsonwebtoken';

function signAccessToken(userId) {
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

export default signAccessToken;
