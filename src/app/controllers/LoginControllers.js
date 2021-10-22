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
                return res.send('<p>Đăng nhập thất bại</p><a style="text-decoration:none" href="/">Về trang chủ</a>');
            }
        })
        .catch(err =>{
            res.status(500).send('loi server');
        })
    }
    logout(req, res, next){
        req.logout();
        res.clearCookie('token');
        res.clearCookie('userid');
        res.redirect('/');
    }
    async changePassword(req, res, next){
        var password = req.body.password;
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        try{
            var accFind = await Account.findById(dataToken._id);
            if(accFind.facebookId=='' && accFind.googleId==''){
                var userUpdate = await Account.findByIdAndUpdate(dataToken._id,{password});
                if(userUpdate){
                    res.send('thanhcong');
                }
                else{
                    res.send('thatbai');
                }
                
            }
            else{
                res.send('thatbai');
            }
        }
        catch{
            res.status(500).send('loi server');
        }
        res.send(req.body.password);
    }
    async checkPassword(req, res, next){
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        try{
            var user = await Account.findById(dataToken._id);
            if(user.password == md5(req.body.password)){
                res.send('0');
            }
            else{
                res.send('1');
            }
        }
        catch{
            res.status(500).send('loi server');
        }
    }
    async changeAfterVerifyForgotPassword(req, res, next){
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        // console.log(data);
        try{
            var accFind = await Account.findOne({username: username, email: email});
            if(accFind.facebookId=='' && accFind.googleId==''){
                var accUpdate = await Account.findOneAndUpdate({username,email},{password});
                if(accUpdate){
                    res.send('thanhcong');
                }
                else{
                    res.send('thatbai');
                }
            }
            else{
                res.send('thatbai');
            }
        }
        catch{
            res.send('err');
        }
    }
}

module.exports = new LoginControllers();
