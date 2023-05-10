const ApiError = require("../exceptions/api_error");
const tokenService = require('../service/token_service');

function authMiddleware(req, res, next) {
  try {
    // достаём аксес токен из headers
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.UnathorizedError());
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnathorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnathorizedError());
    }

    req.user = userData;
    next();
  } catch (error) {
    next(ApiError.UnathorizedError());
  }
}

module.exports = authMiddleware;