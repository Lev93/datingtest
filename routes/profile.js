const express = require('express');

const profileController = require('../controllers/profile');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/', isAuth, profileController.main);
router.post('/update', isAuth, profileController.update);
router.post('/searchProfile', isAuth, profileController.searchProfile);
router.post('/addphoto', isAuth, profileController.addphoto);

module.exports = router;
