const express = require('express');

const mainController = require('../controllers/main');

const router = express.Router();

router.post('/', mainController.main);
router.post('/map', mainController.map);

module.exports = router;
