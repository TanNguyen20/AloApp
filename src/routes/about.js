const express = require('express');
const router = express.Router();
const Account = require('../app/models/account');
const {mulMgToObject, mongooseToObject} = require('../util/mongoose');
const jwt = require('jsonwebtoken');
router.get('/', async (req, res) => {
    
    try{
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        var acc = await Account.findById(dataToken._id);
        var isSocialAccount =false;
        if(acc.googleId!='' || acc.facebookId!='') isSocialAccount = true;
        if(acc){
            res.render('aboutAloApp',{
                user: mongooseToObject(acc),
                isSocialAccount
            });
        }
    }
    catch(err){
        res.render('aboutAloApp');
        console.log('Thong tin loi khi render trang about: ',err);
    }
});
module.exports = router;
