const blogService = require('../service/blog_service');

class BlogController {
  async addMessage(req, res, next) {
    const {date, text} = req.body;
    const author = req.user.id;
    const message = await blogService.addMessage({author, date, text});
    return res.redirect('/');
  }

  async getMessages(req, res, next) {
    const page = +req.query.page || 1;
    const messages = await blogService.getMessages(page);
    return res.json(messages);
  }

  async updateMessage(req, res, next) {
    const messageId = req.params.id;
    const {date, text} = req.body;
    const message = await blogService.updateMessage({messageId, date, text});
    return res.redirect('/');
  }

  async deleteMessage(req, res, next) {
    const messageId = req.params.id;
    const message = await blogService.deleteMessage(messageId);
    return res.redirect('/');
  }
}

module.exports = new BlogController();