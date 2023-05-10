const path = require('path');
const URL = require('url');
const swaggerAutogen = require('swagger-autogen');


const doc = {
  info: {
    title: "Test Blog API",
    description: "Тестовое задание для Welbex."
  },
  definitions: {
    Message: {
      id: '1',
      author: '1',
      text: "Hello world",
      date: '10-05-2023 | 10:01',
      $ref: '#/definitions/Message'
    },
    User: {
      id: '1',
      email: 'test@gmail.com',
      password: '12345'
    },
  }
}

// путь и название генерируемого файла
const outputFile = path.join(__dirname, 'output.json')
// массив путей к роутерам
const endpointsFiles = [path.join(__dirname, '../index.js')]

swaggerAutogen(/*options*/)(outputFile, endpointsFiles, doc).then(({ success }) => {
 console.log(`Generated: ${success}`)
});