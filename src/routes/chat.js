const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/AuthControllers');
const ChatControllers = require('../app/controllers/ChatControllers');
router.get('/videochat', ChatControllers.redirectParamsRoom);
router.post('/checkMess',AuthController.checkTokenUser, ChatControllers.checkMess);
router.get('/videochat/:room', ChatControllers.videoChat);

module.exports = router;
