const express = require('express');
const router = express.Router();
const MeController = require('../app/controllers/MeControllers');
const AuthController = require('../app/controllers/AuthControllers');

router.get('/chat', AuthController.checkTokenUser, MeController.chat);
router.get('/test', MeController.test);
router.get('/chat/:idChat1v1', AuthController.checkTokenUser, MeController.chat1v1);
router.get('/groupChat', AuthController.checkTokenUser, MeController.groupChat);
router.get('/profile', AuthController.checkTokenUser, MeController.profile);
router.get('/friends',AuthController.checkTokenUser, MeController.friends);
router.get('/requestFriends',AuthController.checkTokenUser, MeController.findFriends);
router.post('/changeInfo',MeController.changeInfo);
router.post('/deleteFriend',AuthController.checkTokenUser,MeController.deleteFriend);
router.post('/acceptRequestFriend',AuthController.checkTokenUser,MeController.acceptRequestFriend);
router.post('/deleteRequestFriend',AuthController.checkTokenUser,MeController.deleteRequestFriend);
router.post('/findRequestFriend',AuthController.checkTokenUser,MeController.findRequestFriend);
router.post('/findFriendInListFriends',AuthController.checkTokenUser,MeController.findFriendInListFriends);

module.exports = router;
