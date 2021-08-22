const express = require('express');
const router = express.Router();
const Mecontroller = require('../app/controllers/MeControllers');

router.get('/chat', Mecontroller.chat);
router.get('/profile', Mecontroller.profile);

module.exports = router;
