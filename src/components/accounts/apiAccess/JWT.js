const jwt = require('jsonwebtoken');
require('dotenv').config();

const keyConfig = require('../../../config/env');

class JWT {
  static generateToken(userId, role, expiresInDays = 1) {
    const expiresInSeconds = expiresInDays * 24 * 60 * 60; // 1 day in seconds
    const payload = {
      sub: {
        userId: userId,
        role: role,
      },
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    };

    return jwt.sign(payload, keyConfig.JWT_PRIVATE_KEY, { algorithm: 'RS256' });
  }

  static verifyToken(token) {
    return jwt.verify(token, keyConfig.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
  }
}

export default JWT;
