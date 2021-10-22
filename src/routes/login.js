const express = require('express');
const router = express.Router();
const LoginControllers = require('../app/controllers/LoginControllers');
const AuthController = require('../app/controllers/AuthControllers');
router.post('/', LoginControllers.defaultLogin);
router.post('/changePassword',AuthController.checkTokenUser, LoginControllers.changePassword);
router.post('/checkPassword',AuthController.checkTokenUser, LoginControllers.checkPassword);
router.post('/changeAfterVerifyForgotPassword', LoginControllers.changeAfterVerifyForgotPassword);
router.get('/logout', LoginControllers.logout);
//facebooo va google login da xu li ben auth

module.exports = router;
