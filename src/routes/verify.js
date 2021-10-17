const express = require('express');
const router = express.Router();
const passport = require('passport');
const VerifyControllers = require('../app/controllers/VerifyController');
router.post('/sendEmail',VerifyControllers.sendEmail);
router.post('/sendSMS',VerifyControllers.sendSMS);
router.get('/email',VerifyControllers.verifyMail);

module.exports = router;
