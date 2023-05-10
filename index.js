require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const userRouter = require('./router/userRouter');
const blogRouter = require('./router/blogRouter');
const commonRouter = require('./router/index');
const errorMiddleware = require('./middlewares/error_middleware');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const blogService = require('./service/blog_service');


const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json')); 
const PORT = process.env.PORT || 5000;
const app = express();

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use('/api/messages', blogRouter);
app.use('/api/users', userRouter);
app.use('/', commonRouter);
app.use(errorMiddleware);

async function populateDB() {
  const authorID = "645b85491ae44e2beea5c415";

  for (let i = 0; i < 74; i++) {
    let date;
    if (i < 30) {
      date = `${i + 1}-05-2023 12:23`;
    } else if (i < 60) {
      date = `${i - 30}-06-2023 12:23`;
    } else {
      date = `${i - 60}-07-2023 12:23`;
    }

    let text = `Сообщение номер ${i + 1}`;

    await blogService.addMessage({author: authorID, date, text});
  }
}

async function start() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    app.listen(PORT, () => console.log("Server started on port" + ` ${PORT}`));
    // app.listen(PORT, () => populateDB());
  } catch (error) {
    console.log(error);
  }
} 

start();