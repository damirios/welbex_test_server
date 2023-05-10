const nodemailer = require('nodemailer');

class MailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }

  async sendActivationLink(email, activationLink) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Активация аккаунта " + process.env.API_URL,
      text: '',
      html: 
        `
          <div>
            <h1>Для активации аккаунта перейдите по ссылке </h1>
            <a href="${activationLink}">${activationLink}</a>
          </div>
        `
    }, (error, info) => {
      return console.log(error.message);
    });
  }
}

module.exports = new MailService();