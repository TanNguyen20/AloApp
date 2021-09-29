const express = require('express');
const router = express.Router();
const passport = require('passport');
const RegisterControllers = require('../app/controllers/RegisterControllers');
const VerifyControllers = require('../app/controllers/VerifyController');
//// google
router.get('/sms',VerifyControllers.verifySMS);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// authendication with google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), VerifyControllers.createUserWithGoogle);
//
router.get("/inforWithGoogle", RegisterControllers.ensureAuth, RegisterControllers.inforWithGoogle);
router.get('/verify',VerifyControllers.verifyMail);
//// facebook
// choose aacount login with facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));
// successRedirect co the thay the cho function ben duoi sau failureRedirect tham khao cach dung function o auth voi google
//    function(req, res) {
//      res.redirect('/product/oppo-reno5');
//    }
router.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/chat/videochat', failureRedirect: '/' })
);
//
router.get("/inforWithFacebook", RegisterControllers.ensureAuth, RegisterControllers.inforWithFacebook);
////

//chung
router.get('/logout', RegisterControllers.logout);
router.get('/upload', RegisterControllers.upload);
router.get('/testENV', RegisterControllers.testENV);

router.post('/checkUserName', RegisterControllers.checkUserName);


module.exports = router;
