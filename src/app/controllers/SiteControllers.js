const Account = require('../models/account');
const {mongooseToObject, mulMgToObject} = require('../../util/mongoose');
const jwt = require('jsonwebtoken');
var md5 = require('md5');
class SiteControllers {
    async homePage(req, res, next) {
        var token = req.cookies.token;
        if(token){
            var decoded = jwt.verify(token, 'mk');
            try {
                var user = await Account.findById(decoded._id);
                if(user){
                    res.render('home', {user: mongooseToObject(user)});
                }
                else{
                    res.render('home');
                }
            } catch (error) {
                res.json('Co loi khi render home, khong tim duoc user');
            }

        }
        else{
            res.render('home');
        }
    }
}

module.exports = new SiteControllers();
