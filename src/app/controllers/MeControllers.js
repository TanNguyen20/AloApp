const {mulMgToObject, mongooseToObject} = require('../../util/mongoose');
const Account = require('../models/account');
const Message = require('../models/messages');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
//const {MongooseToObject} = require('../../util/mongoose')
class MeControllers {
    changeInfo(req, res, next){
        // console.log(req.body);
        var dataUpdate = req.body;
        var numberPhone =  req.body.numberPhone;
        var displayName = req.body.displayName;
        var email = req.body.email;
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        console.log(dataToken._id)
        Account.updateOne({_id: dataToken._id},{numberPhone, displayName, email})
        .then((dt)=>{
            // console.log(dt);
            res.send('1');
        })
        .catch((err)=>{
            res.send('0');
        })
        
    }
    changeAvatar(req, res, next){
        // console.log(req.body);
        var avatar =  req.body.avatar;
        var urlSplit = avatar.split('/upload');
        var newUrl = urlSplit[0]+'/upload/c_scale,h_200,w_200'+urlSplit[1];
        // console.log(newUrl);
        avatar = newUrl;
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        // console.log(dataToken._id);
        Account.updateOne({_id: dataToken._id},{avatar})
        .then((dt)=>{
            // console.log(dt);
            res.send(newUrl);
        })
        .catch((err)=>{
            res.send('0');
        })
        
    }
    changeBackground(req, res, next){
        var imageBackground =  req.body.imageBackground;
        var urlSplit = imageBackground.split('/upload');
        var newUrl = urlSplit[0]+'/upload/c_scale,h_280'+urlSplit[1];
        imageBackground = newUrl;
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        // console.log(dataToken._id);
        Account.updateOne({_id: dataToken._id},{imageBackground})
        .then((dt)=>{
            console.log(dt);
            res.send(newUrl);
        })
        .catch((err)=>{
            res.send('0');
        })
        
    }
    async test(req, res, next) {
        var acc = await Account.findOne({googleId:'116050248282285785128'}).populate('arrPop');
        res.json(acc);
        console.log(acc);
    }
    async chat(req, res, next) {
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        var acc = await Account.findById(dataToken._id).populate('arrayIdChat1v1._id').populate('arrayIdChat1v1.idFriend').populate('friends');
        // console.log(acc);
        var existFriend = acc.friends.length;
        var haveFriend = false;
        if(existFriend>0) haveFriend = true;
        // console.log('exis:', haveFriend)
        var isSocialAccount =false;
        var listChat = acc.arrayIdChat1v1;
        var lastChat = acc.arrayIdChat1v1[acc.arrayIdChat1v1.length-1];
        var arrContentLastChat = [];
        var infoFriendLastChat={};
        var listMediaInLastChat = [];
        var listDocument = [];
        listMediaInLastChat = lastChat._id.arrayContent1v1.filter(element => (element.typeMess=='image' || element.typeMess=='video'));
        listDocument = lastChat._id.arrayContent1v1.filter(element => (element.typeMess=='document'));
        if(lastChat) {
            arrContentLastChat=lastChat._id.arrayContent1v1;
            infoFriendLastChat.displayName = lastChat.idFriend.displayName;
            infoFriendLastChat.avatar = lastChat.idFriend.avatar;
            infoFriendLastChat._id = lastChat.idFriend._id;
        }
        var you = acc.displayName;
        // console.log(lastChat._id._id);
        if(acc.googleId!='' || acc.facebookId!='') isSocialAccount = true;

        if(acc){
            // console.log(infoFriendLastChat);
            var idMessLastChat ='';
            if(lastChat) idMessLastChat = lastChat._id._id;
            if(haveFriend){
                res.render('chat',{
                    user: mongooseToObject(acc),
                    friend: infoFriendLastChat,
                    existFriend: haveFriend,
                    isSocialAccount,
                    arrContentChat: arrContentLastChat,
                    idMessLastChat,
                    you,
                    listChat,
                    listMediaInLastChat,
                    listDocument
                });
            }
            else{
                res.render('chat',{
                    user: mongooseToObject(acc),
                    friend:null,
                    isSocialAccount,
                    arrContentChat: arrContentLastChat,
                    you,
                    listChat
                });
            }
        }
        else{
            res.render('chat');
        }
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
                var isSocialAccount =false;
                if(data.googleId!='' || data.facebookId!='') isSocialAccount = true;
                res.render('profile',{
                    info:mongooseToObject(data),
                    user: mongooseToObject(data),
                    isSocialAccount
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
    async groupChat(req, res, next) {
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        var acc = await Account.findById(dataToken._id);
        var isSocialAccount =false;
        if(acc.googleId!='' || acc.facebookId!='') isSocialAccount = true;
        if(acc){
            res.render('groupChat',{
                user: mongooseToObject(acc),
                isSocialAccount
            });
        }
        else{
            res.render('groupChat');
        }
    }
    async friends(req, res, next) {
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        var listFriends = await Account.findById(dataToken._id).populate('friends');
        var isSocialAccount =false;
        if(listFriends.googleId!='' || listFriends.facebookId!='') isSocialAccount = true;
        // console.log(listFriends);
        res.render('friends',{
            listFriends:listFriends.friends,
            totalFriends: listFriends.friends.length,
            totalWaitAcceptFriends: listFriends.waitAcceptFriends.length,
            isSocialAccount,
            user: mongooseToObject(listFriends)
        });
    }
    async findFriends(req, res, next) {

        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        var acc = await Account.findById(dataToken._id).populate('waitAcceptFriends');
        var listRequest =acc.waitAcceptFriends;
        var isSocialAccount =false;
        if(acc.googleId!='' || acc.facebookId!='') isSocialAccount = true;
        // console.log(listRequest);
        res.render('findAndRequestFriends',{
            listRequest,
            isSocialAccount,
            user: mongooseToObject(acc)
        });
    }
    async deleteFriend(req,res, next) {
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        var idFriend = req.body.idFriendDelete;
        const friendObjectId = new mongoose.Types.ObjectId(idFriend);
        var accFind = await Account.findById(idFriend);
        var accFind1 = await Account.findById(dataToken._id);
        var infoDelete ={};
        infoDelete=friendObjectId;
        // infoDelete.displayNameFriend=accFind.displayName;
        // infoDelete.avatarFriend=accFind.avatar;
        var infoDelete1 ={};
        infoDelete1=accFind1._id;
        // infoDelete1.displayNameFriend=accFind1.displayName;
        // infoDelete1.avatarFriend=accFind1.avatar;
        // console.log(infoDelete);
        try {
            var accUpdate = await Account.findByIdAndUpdate(dataToken._id, {$pull: {friends: infoDelete}});
            var accUpdate1 = await Account.findByIdAndUpdate(idFriend, {$pull: {friends: infoDelete1}});
            // console.log(friendObjectId);
            res.send(idFriend);
        } catch (error) {
            res.send('err')
        }
    }
    async acceptRequestFriend(req, res){
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        var idRequestFriend = req.body.idRequest;
        console.log(idRequestFriend);
        const requestFriendObjectId = new mongoose.Types.ObjectId(idRequestFriend);
        var accFind = await Account.findById(idRequestFriend);
        var accFind1 = await Account.findById(dataToken._id);
        
        var infoWait ={};
        var infoFriend = {};
        infoWait=requestFriendObjectId;
        // infoWait.displayNameWaitAcceptFriend=accFind.displayName;
        // infoWait.avatarWaitAcceptFriend=accFind.avatar;
        //
        infoFriend=requestFriendObjectId;
        // infoFriend.displayNameFriend=accFind.displayName;
        // infoFriend.avatarFriend=accFind.avatar;
        //
        var infoRequest ={};
        var infoFriend1 = {};
        infoRequest=accFind1._id;
        // infoRequest.displayNameRequestFriend=accFind1.displayName;
        // infoRequest.avatarRequestFriend=accFind1.avatar;
        //
        infoFriend1=accFind1._id;
        // infoFriend1.displayNameFriend=accFind1.displayName;
        // infoFriend1.avatarFriend=accFind1.avatar;
        try{
            var accUpdate = await Account.findByIdAndUpdate(dataToken._id, {$push: {friends: infoFriend},$pull: {waitAcceptFriends: infoWait}});
            var accUpdate2 = await Account.findByIdAndUpdate(idRequestFriend, {$pull:{requestFriends: infoRequest},$push: {friends: infoFriend1}});
            console.log(requestFriendObjectId);
            res.send(idRequestFriend);
        }
        catch{
            res.send('err');
        }

    }
    async deleteRequestFriend(req, res){
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        var idRequestFriend = req.body.idRequest;
        const requestFriendObjectId = new mongoose.Types.ObjectId(idRequestFriend);
        var accFind = await Account.findById(idRequestFriend);
        var accFind1 = await Account.findById(dataToken._id);
        
        var infoWait ={};
        var infoFriend = {};
        infoWait=requestFriendObjectId;
        // infoWait.displayNameWaitAcceptFriend=accFind.displayName;
        // infoWait.avatarWaitAcceptFriend=accFind.avatar;
        //
        infoFriend=requestFriendObjectId;
        // infoFriend.displayNameFriend=accFind.displayName;
        // infoFriend.avatarFriend=accFind.avatar;
        //
        var infoRequest ={};
        var infoFriend1 = {};
        infoRequest=accFind1._id;
        // infoRequest.displayNameRequestFriend=accFind1.displayName;
        // infoRequest.avatarRequestFriend=accFind1.avatar;
        //
        infoFriend1=accFind1._id;
        // infoFriend1.displayNameFriend=accFind1.displayName;
        // infoFriend1.avatarFriend=accFind1.avatar;
        try{
            var accUpdate = await Account.findByIdAndUpdate(dataToken._id, {$pull: {waitAcceptFriends: infoWait}});
            var accUpdate2 = await Account.findByIdAndUpdate(idRequestFriend, {$pull:{requestFriends: infoRequest}});
            console.log(requestFriendObjectId);
            res.send(idRequestFriend);
        }
        catch{
            res.send('err');
        }
    }
    async findRequestFriend(req, res, next) {
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        var findRequestFriend = req.body.findRequestFriend;
        var regexFindRequestFriends = new RegExp(findRequestFriend, "i");
        try{
            var acc = await Account.findById(dataToken._id).populate('waitAcceptFriends');
            var listRequest =acc.waitAcceptFriends;
            var arrData=[];
            listRequest.forEach(element => {
                if(regexFindRequestFriends.test(element.displayName)) arrData.push(element);
            });
            res.send(arrData);
        }
        catch{
            res.send([]);
        }
    }
    async findFriendInListFriends(req, res, next) {
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        var findFriend = req.body.findFriend;
        var regexFindFriend = new RegExp(findFriend, "i");
        try{
            var acc = await Account.findById(dataToken._id).populate('friends');
            var listFriends =acc.friends;
            var arrData=[];
            listFriends.forEach(element => {
                if(regexFindFriend.test(element.displayName)) arrData.push(element);
            });
            console.log(arrData);
            res.send(arrData);
        }
        catch{
            res.send([]);
        }
    }
}

module.exports = new MeControllers();
