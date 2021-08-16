const express = require('express');
const router = express.Router();
const Sitecontroller = require('../app/controllers/SiteControllers');
router.get('/', Sitecontroller.homePage);
// router.get('/registers', Sitecontroller.registers);
// router.get('/login', Sitecontroller.login);
module.exports = router;
