const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token_model');

class TokenService {
  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
      expiresIn: '15m'
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: '30d'
    });

    return {accessToken, refreshToken};
  }

  async saveTokenInDB(userId, refreshToken) {
    // ищем рефреш токен в БД по userId
    const tokenData = await tokenModel.findOne({user: userId});
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save(); // перезаписываем рефреш токен
    }
    // если не нашли такого токена, то надо создать
    const token = await tokenModel.create({user: userId, refreshToken});
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({refreshToken});
    return tokenData;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async findToken(token) {
    const tokenData = await tokenModel.findOne({refreshToken: token});
    return tokenData;
  }
}

module.exports = new TokenService();