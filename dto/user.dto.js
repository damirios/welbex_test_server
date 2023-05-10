class UserDto {
  email;
  id;
  isActivated;

  constructor(userModel) {
    this.email = userModel.email;
    this.id = userModel._id;
    this.isActivated = userModel.isActivated;
  }
}

module.exports = UserDto;