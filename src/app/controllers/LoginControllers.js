const Account = require('../models/account');
const {mongooseToObject, mulMgToObject} = require('../../util/mongoose');
const jwt = require('jsonwebtoken');
var md5 = require('md5');
class LoginControllers {
    defaultLogin(req, res, next){
        const formData = req.body;
        var username = formData.usernameLogin;
        var password = md5(formData.passwordLogin);
        Account.findOne({
            username: username, 
            password: password,
        })
        .then(data =>{
            if(data){
               jwt.sign({_id: data._id},'mk',{ expiresIn: '1h' },(err, token) =>{
                    res.cookie('token',token,{maxAge: 3600000});
                    res.cookie('userid',data._id,{maxAge: 3600000});
                    //render du lieu
                    res.redirect('/');
               });
                
            }
            else{
                return res.send('<p>Đăng nhập thất bại</p><a style="text-decoration:none" href="/user/Login">Về trang đăng nhập</a>');
            }
        })
        .catch(err =>{
            res.status(500).json('loi server');
        })
    }
    logout(req, res, next){
        req.logout();
        res.clearCookie('token');
        res.clearCookie('userid');
        res.redirect('/');
    }
}

module.exports = new LoginControllers();
