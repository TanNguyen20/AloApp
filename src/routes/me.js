const express = require('express');
const router = express.Router();
const Mecontroller = require('../app/controllers/MeControllers');

router.get('/chat/:userreceive', Mecontroller.chat);
router.get('/groupChat', Mecontroller.groupChat);
router.get('/profile', Mecontroller.profile);
router.get('/friends', Mecontroller.friends);
router.get('/findFriends', Mecontroller.findFriends);

module.exports = router;
