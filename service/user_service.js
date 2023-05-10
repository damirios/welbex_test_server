const userModel = require('../models/user_model');
const mailService = require('../service/mail_service');
const tokenService = require('../service/token_service');
const UserDto = require('../dto/user.dto');
const ApiError = require('../exceptions/api_error');

const bcrypt = require('bcrypt');
const uuid = require('uuid');

class UserService {
  async signup(email, password) {
    const candidate = await userModel.findOne({email});
    if (candidate) {
      throw ApiError.BadRequest("Пользователь с таким email уже существует!");
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const activationLink = uuid.v4();
    const user = await userModel.create({email, password: hashedPassword, activationLink});

    await mailService.sendActivationLink(email, process.env.API_URL + `/api/users/activate/${activationLink}`); // отправляем ссылку активации на почту

    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({...userDto});
    
    // сохраняем рефреш токен в БД
    await tokenService.saveTokenInDB(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    };
  }

  async login(email, password) {
    const user = await userModel.findOne({email});
    
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден!");
    }

    const arePasswordsMatch = await bcrypt.compare(password, user.password);
    if (!arePasswordsMatch) {
      throw ApiError.BadRequest("Неверный пароль!");
    }

    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({...userDto});

    await tokenService.saveTokenInDB(userDto.id, tokens.refreshToken);
    return {...tokens, user: {...userDto}};
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnathorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenInDB = await tokenService.findToken(refreshToken);

    if (!userData || !tokenInDB) {
      throw ApiError.UnathorizedError();
    }

    const user = await userModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({...userDto});

    await tokenService.saveTokenInDB(userDto.id, tokens.refreshToken);
    return {...tokens, user: {...userDto}};
  }

  async activate(activationLink) {
    const user = await userModel.findOne({activationLink});
    if (!user) {
      throw ApiError.BadRequest('Неправильная ссылка активации');
    }

    user.isActivated = true;
    await user.save();
  }

  async getUsers() {
    const users = await userModel.find({});
    return users;
  }
}

module.exports = new UserService();