const ApiError = require("../exceptions/api_error");
const tokenService = require('../service/token_service');
const messageModel = require('../models/message_model');

async function authorMiddleware(req, res, next) {
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

    const message = await messageModel.findById(req.params.id);

    if (userData.id !== message.author._id.toString()) {
      return next(ApiError.ForbiddenError());
    }

    next();
  } catch (error) {
    next(ApiError.UnathorizedError());
  }
}

module.exports = authorMiddleware;