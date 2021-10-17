const express = require('express');
const router = express.Router();
const LoginControllers = require('../app/controllers/LoginControllers');
router.post('/', LoginControllers.defaultLogin);
router.get('/logout', LoginControllers.logout);
//facebooo va google login da xu li ben auth

module.exports = router;
