const Router = require("express").Router;
const user_controller = require('../controllers/user_controller');
const { body } = require('express-validator');
const authMiddleware = require("../middlewares/auth_middleware");

const router = new Router();

router.post('/signup', 
  body('email').isEmail(),
  body('password').isLength({min: 4, max: 24}),
  user_controller.signup);
router.post('/login', user_controller.login);
router.post('/logout', user_controller.logout);
router.get('/activate/:activationLink', user_controller.activate);
router.get('/refresh', user_controller.refresh);
router.get('/', user_controller.getUsers);


module.exports = router; 