const Router = require("express").Router;
const blog_controller = require("../controllers/blog_controller");
const authMiddleware = require("../middlewares/auth_middleware");
const authorMiddleware = require('../middlewares/author_middleware');

const router = new Router();

router.post('/', authMiddleware, blog_controller.addMessage);
router.get('/', blog_controller.getMessages);
router.put('/:id', authorMiddleware, blog_controller.updateMessage);
router.delete('/:id', authorMiddleware, blog_controller.deleteMessage);


module.exports = router; 