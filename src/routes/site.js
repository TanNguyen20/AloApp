const express = require('express');
const router = express.Router();
const Sitecontroller = require('../app/controllers/SiteControllers');
router.get('/', Sitecontroller.homePage);
router.post('/forgotPassword', Sitecontroller.forgotPassword);
router.get('/forgotPassword', Sitecontroller.forgotPasswordMethodGet);
module.exports = router;
