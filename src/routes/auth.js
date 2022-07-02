const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthControllers = require('../app/controllers/AuthControllers');


// google register
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), AuthControllers.createUserWithGoogle);
router.get("/inforWithGoogle", AuthControllers.ensureAuth, AuthControllers.inforWithGoogle);

// facebook register
router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email']}));
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/404', successRedirect: '/' }),
    AuthControllers.createUserWithFacebook
);
router.get("/inforWithFacebook", AuthControllers.ensureAuth, AuthControllers.inforWithFacebook);

//chung fb google
router.get('/logout', AuthControllers.logout);

module.exports = router;
