
const {mulMgToObject, mongooseToObject} = require('../../util/mongoose');
const Account = require('../models/account');
const Message = require('../models/messages');
const jwt = require('jsonwebtoken');

//const {MongooseToObject} = require('../../util/mongoose')
class MeControllers {
    changeInfo(req, res, next){
        console.log(req.body);
        var dataUpdate = req.body;
        var numberPhone =  req.body.numberPhone;
        var displayName = req.body.displayName;
        var email = req.body.email;
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        console.log(dataToken._id)
        Account.updateOne({_id: dataToken._id},{numberPhone, displayName, email})
        .then((dt)=>{
            console.log(dt);
            res.send('1');
        })
        .catch((err)=>{
            res.send('0');
        })
        
    }
    chat(req, res, next) {
        res.render('chat');
    }
    chat1v1(req, res, next) {
        var idChat1v1 = req.params.idChat1v1;
        res.json(req.params.idChat1v1);
    }
    profile(req, res, next) {
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        Account.findById(dataToken._id)
        .then((data)=>{
            if(data){
                res.render('profile',{
                    info:mongooseToObject(data)
                });
            }
            else{
                res.send('Không tồn tại tài khoản với token này');
            }
        })
        .catch((err)=>{
            res.redirect('/');
        })
    }
    groupChat(req, res, next) {
        res.render('groupChat');
    }
    friends(req, res, next) {
        res.render('friends');
    }
    findFriends(req, res, next) {
        res.render('findAndRequestFriends');
    }
}

module.exports = new MeControllers();
