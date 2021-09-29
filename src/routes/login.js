const express = require('express');
const router = express.Router();
const LoginControllers = require('../app/controllers/LoginControllers');
router.get('/facebook', LoginControllers.facebook);
router.get('/google', LoginControllers.google);
router.post('/check', LoginControllers.check);

module.exports = router;
