
const { mulMgToObject } = require('../../util/mongoose');
const Account = require('../models/account');
const Message = require('../models/messages');

//const {MongooseToObject} = require('../../util/mongoose')
class MeControllers {
    async chat(req, res, next) {
        res.render('chat');
        // if(req.cookies.token){
        //     var token = req.cookies.token;
        //     var result = jwt.verify(token,'mk');
        //     // res.json(result);
        //     if(result){
        //         try {
        //             var acc = await Account.findOne({_id: result._id});
        //             var mess = await Messages.find({$or: [{from: acc.username,to: 'admin'},{from: 'admin', to: acc.username},{from: req.params.userreceive,to: 'admin'},{from: 'admin', to: req.params.userreceive}]}).sort({createdAt:'asc'});
        //             // res.json(req.params.userreceive);
        //             res.render('chat',{
        //                 username: acc.username,
        //                 mess: mulMgToObject(mess),
        //             })
        //         } catch (error) {
        //             res.json('Khong tim thay tin nhan');
        //         }
                

        //     }
        // }
        // else{
        //     res.redirect('/');
        // }
    }
    profile(req, res, next) {
        res.render('profile');
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
