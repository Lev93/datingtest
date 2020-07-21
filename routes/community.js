const express = require('express');

const communityController = require('../controllers/community');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.post('/searchProfile', isAuth, communityController.searchProfile);
router.post('/advancedsearch', isAuth, communityController.advancedsearch);
router.post('/mapsearch', isAuth, communityController.mapsearch);
router.post('/search', isAuth, communityController.search);
router.post('/user', communityController.user);
router.post('/quickmatch', isAuth, communityController.quickmatch);
router.post('/quickmatchnext', isAuth, communityController.quickmatchnext);

module.exports = router;
