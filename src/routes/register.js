const express = require('express');
const router = express.Router();
const passport = require('passport');
const RegisterControllers = require('../app/controllers/RegisterControllers');

///// 
router.post('/',RegisterControllers.registerDefault);

router.get('/upload', RegisterControllers.upload);
//kiem tra khi dang ki
router.post('/checkUserName', RegisterControllers.checkUserName);
router.post('/checkEmail', RegisterControllers.checkEmail);


module.exports = router;
