const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/AuthControllers');
const ChatControllers = require('../app/controllers/ChatControllers');
router.post('/checkMess',AuthController.checkTokenUser, ChatControllers.checkMess);
router.post('/checkGroup',AuthController.checkTokenUser, ChatControllers.checkGroup);

module.exports = router;
