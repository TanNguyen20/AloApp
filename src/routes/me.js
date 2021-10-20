const express = require('express');
const router = express.Router();
const MeController = require('../app/controllers/MeControllers');
const AuthController = require('../app/controllers/AuthControllers');

router.get('/chat', MeController.chat);
router.get('/chat/:idChat1v1', MeController.chat1v1);
router.get('/groupChat', MeController.groupChat);
router.get('/profile', AuthController.checkTokenUser, MeController.profile);
router.get('/friends',AuthController.checkTokenUser, MeController.friends);
router.get('/findFriends',AuthController.checkTokenUser, MeController.findFriends);
router.post('/changeInfo',MeController.changeInfo);
router.post('/deleteFriend',AuthController.checkTokenUser,MeController.deleteFriend);
router.post('/acceptRequestFriend',AuthController.checkTokenUser,MeController.acceptRequestFriend);
router.post('/deleteRequestFriend',AuthController.checkTokenUser,MeController.deleteRequestFriend);
router.post('/findRequestFriend',AuthController.checkTokenUser,MeController.findRequestFriend);
router.post('/findFriendInListFriends',AuthController.checkTokenUser,MeController.findFriendInListFriends);

module.exports = router;
