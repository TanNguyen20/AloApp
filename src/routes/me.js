const express = require('express');
const router = express.Router();
const Mecontroller = require('../app/controllers/MeControllers');

router.get('/', Mecontroller.me);

module.exports = router;
