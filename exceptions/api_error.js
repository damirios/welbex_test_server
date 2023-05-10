class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnathorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static UnathorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }

  static ForbiddenError() {
    return new ApiError(403, "Доступ запрещён");
  }
}

module.exports = ApiError;