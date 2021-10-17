const express = require('express');
const router = express.Router();
const FindFriendsControllers = require('../app/controllers/FindFriendsControllers');
const AuthController = require('../app/controllers/AuthControllers');
router.get('/', AuthController.checkTokenUser ,FindFriendsControllers.findFriends);
router.post('/default',AuthController.checkTokenUser ,FindFriendsControllers.defaultFindFriends);
router.get('/facebook', AuthController.checkTokenUser,FindFriendsControllers.facebookFindFriends);
router.post('/sendRequestFriends',AuthController.checkTokenUser ,FindFriendsControllers.sendRequestFriends);

module.exports = router;