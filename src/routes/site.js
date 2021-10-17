const express = require('express');
const router = express.Router();
const Sitecontroller = require('../app/controllers/SiteControllers');
router.get('/', Sitecontroller.homePage);
module.exports = router;
