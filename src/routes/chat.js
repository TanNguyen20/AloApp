const express = require('express');
const router = express.Router();
const ChatControllers = require('../app/controllers/ChatControllers');
router.get('/videochat', ChatControllers.redirectParamsRoom);
router.get('/videochat/:room', ChatControllers.videoChat);

module.exports = router;
