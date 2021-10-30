const passport = require('passport');
const User = require('../models/user');
const md5 = require('md5');
const Account = require('../models/account');
const { mongooseToObject } = require('../../util/mongoose');
const { mulMgToObject } = require('../../util/mongoose');
//
const jwt = require('jsonwebtoken');

//
class AuthControllers {
    facebook(req, res, next) {
        res.send("Register with facebook");
    }
    authendicationGoogle(req, res, next) {
        if (passport.authenticate('google', { failureRedirect: '/' })) {
            next();
        }
        else {
            res.json('that bai');
        }
    }
    createUserWithFacebook(req, res, next) {
        if(req.user.isVerified){
            jwt.sign({_id: req.user._id},'mk',{ expiresIn: '1h' },(err, token) =>{
                res.cookie('token',token,{maxAge: 3600000});
                res.cookie('userid',req.user._id,{maxAge: 3600000});
                res.redirect('/');
            });
            // render du lieu ra trang home
            res.render('home',{
                status:'0'
            });

        }
        else{
            var newAccWithFacebook ={};
            newAccWithFacebook['facebookId'] = req.user.facebookId;
            newAccWithFacebook['username'] = req.user.facebookId;
            newAccWithFacebook['email'] = req.user.email;
            newAccWithFacebook['avatar'] = req.user.avatar;
            newAccWithFacebook['displayName'] = req.user.displayName;
            newAccWithFacebook['isVerified'] = true;
            var newAcc =  new Account(newAccWithFacebook);
            // res.json(newAcc);  
            newAcc.save()
            .then((data)=>{
                // res.json(data);
                if(data){
                    res.render('registerWithSocial',{
                        status:'1'
                    });
                }
            })
            .catch((err)=>{
                //se tu dong dang nhap luon ,se fix sau hien tai chua fix
                res.redirect('/');
            }) 
        }
        
    }
    createUserWithGoogle(req, res, next) {
        if(req.user.isVerified){
            var data = req.user;
            jwt.sign({_id: data._id},'mk',{ expiresIn: '1h' },(err, token) =>{
                res.cookie('token',token,{maxAge: 3600000});
                res.cookie('userid',data._id,{maxAge: 3600000});
                res.redirect('/');
           });
        }
        else{
            var newAccWithGoogle ={};
            newAccWithGoogle['googleId'] = req.user.googleId;
            newAccWithGoogle['username'] = req.user.googleId;
            newAccWithGoogle['email'] = req.user.email;
            newAccWithGoogle['avatar'] = req.user.avatar;
            newAccWithGoogle['displayName'] = req.user.displayName;
            newAccWithGoogle['isVerified'] = true;
            var newAcc =  new Account(newAccWithGoogle);
            newAcc.save()
            .then((data)=>{
                // res.json(data);
                if(data){
                    res.render('registerWithSocial',{
                        status:'1'
                    });
                }
            })
            .catch((err)=>{
                res.render('registerWithSocial',{
                    status:'0'
                });
            })
        }
    }

    ensureAuth(req, res, next) {
        if (req.isAuthenticated()) {
          return next()
        } else {
          res.redirect('/')
        }
    }

    ensureGuest(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/product/samsung-galaxy-s20');
        }
    }

    inforWithGoogle(req, res, next) {
        res.render('home', {
            info: mongooseToObject(req.user)
        });
    }

    inforWithFacebook(req, res, next) {
        res.json(req.user);
    }
    // logout facebook google
    logout(req, res) {
        req.logout();
        res.redirect('/');
    }
    checkTokenUser(req, res, next) {
        var token = req.cookies.token;
        if(token){
            jwt.verify(token,'mk',(err,decode)=>{
                if(err){
                    res.send('token lỗi khi verify');
                }
                else{
                   next();
                }
            });
        }
        else{
            res.send('Hết phiên đăng nhập về trang chủ để đăng nhập\n<a href="/" style="text-decoration: none;">Về trang chủ</a>');
        }
    }

}

module.exports = new AuthControllers();
