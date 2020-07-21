const express = require('express');

const messagesController = require('../controllers/messages');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/', isAuth, messagesController.main);
router.post('/messages', isAuth, messagesController.messages);
router.post('/changestatus', isAuth, messagesController.changestatus);
router.post('/newmessage', isAuth, messagesController.newmessage);
router.post('/filter', isAuth, messagesController.filter);
router.post('/searchContacts', isAuth, messagesController.searchContacts);

module.exports = router;
