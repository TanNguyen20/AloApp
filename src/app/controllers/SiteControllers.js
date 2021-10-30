const Account = require('../models/account');
const {mongooseToObject, mulMgToObject} = require('../../util/mongoose');
const jwt = require('jsonwebtoken');
var md5 = require('md5');
SECRET_KEY_EMAIL = process.env.SECRET_SEND_EMAIL;
class SiteControllers {
    async homePage(req, res, next) {
        var token = req.cookies.token;
        if(token){
            var decoded = jwt.verify(token, 'mk');
            try {
                var user = await Account.findById(decoded._id);
                var isSocialAccount =false;
                if(user.googleId!='' || user.facebookId!='') isSocialAccount = true;
                if(user){
                    res.render('home', {
                        user: mongooseToObject(user),
                        isSocialAccount
                    });
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
    forgotPasswordMethodGet(req, res, next) {
        var token = req.query.id;
        if (token) {
            try {
                jwt.verify(token, SECRET_KEY_EMAIL, (e, decoded) => {
                    if (e) {
                        console.log(e)
                        return res.sendStatus(403);
                    } else {
                        var email = decoded.email;
                        var username = decoded.username;
                        res.render('forgotPassword', { email, username });
                    }

                });
            } catch (err) {
                console.log(err);
                return res.sendStatus(403);
            }
        } else {
            res.json('khong ton tai token, hoac token da het han');
            return res.sendStatus(403).redirect('/');

        }
    }
}

module.exports = new SiteControllers();
