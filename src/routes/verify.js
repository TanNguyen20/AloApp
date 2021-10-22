const express = require('express');
const router = express.Router();
const passport = require('passport');
const VerifyControllers = require('../app/controllers/VerifyController');
router.post('/sendEmail',VerifyControllers.sendEmail);
router.post('/sendSMS',VerifyControllers.sendSMS);
router.post('/sendEmailForgotPassword',VerifyControllers.sendEmailForgotPassword);
// khong co verify forgot password la do con nhap mat khau moi phai su li ben site controller
router.get('/email',VerifyControllers.verifyMail);

module.exports = router;
