const ApiError = require('../exceptions/api_error');
const messageModel = require('../models/message_model');

const MESSAGES_AMOUNT = 20;

class BlogService {
  async addMessage({author, date, text}) {
    const message = await messageModel.create({author, date, text});
    return message;
  }

  async getMessages(page) {
    const messages = await messageModel.find({}, null, {
      sort: {_id: 1}
    }); 

    let firstIndex = (page - 1) * MESSAGES_AMOUNT;
    let lastIndex = page * MESSAGES_AMOUNT < messages.length ? page * MESSAGES_AMOUNT : messages.length;
    
    return messages.slice(firstIndex, lastIndex);
  }

  async updateMessage({messageId, date, text}) {
    const message = await messageModel.findById(messageId);
    if (!message) {
      throw ApiError.BadRequest();
    }

    message.text = text;
    message.date = date;
    await message.save();
    return message;
  }

  async deleteMessage(messageId) {
    const message = await messageModel.findByIdAndRemove(messageId);
    if (!message) {
      throw ApiError.BadRequest();
    }

    return message;
  }
}

module.exports = new BlogService();
