const Router = require("express").Router;
const router = new Router();


/**
 * @swagger
 * /message12s:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
*/
router.get('/', (req, res, next) => {
  res.redirect('/api/messages');
});

module.exports = router;