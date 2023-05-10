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


async function start() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    app.listen(PORT, () => console.log("Server started on port" + ` ${PORT}`));
  } catch (error) {
    console.log(error);
  }
} 

start();