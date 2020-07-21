const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/registration', authController.reg);
router.post('/login', authController.login);
router.post('/getcoordinates', authController.getcoordinates);

module.exports = router;
