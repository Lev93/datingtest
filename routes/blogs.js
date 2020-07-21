const express = require('express');

const blogsController = require('../controllers/blogs');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/', blogsController.main);
router.post('/getnewblogs', blogsController.getnewblogs);
router.post('/create', isAuth, blogsController.create);
router.post('/newcomment', isAuth, blogsController.newcomment);
router.post('/like', isAuth, blogsController.like);
router.post('/getblog', blogsController.getblog);

module.exports = router;
