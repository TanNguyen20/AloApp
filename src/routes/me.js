const express = require('express');
const router = express.Router();
const MeController = require('../app/controllers/MeControllers');
const AuthController = require('../app/controllers/AuthControllers');

router.get('/chat', MeController.chat);
router.get('/chat/:idChat1v1', MeController.chat1v1);
router.get('/groupChat', MeController.groupChat);
router.get('/profile', AuthController.checkTokenUser, MeController.profile);
router.get('/friends', MeController.friends);
router.get('/findFriends', MeController.findFriends);
router.post('/changeInfo',MeController.changeInfo);
module.exports = router;
