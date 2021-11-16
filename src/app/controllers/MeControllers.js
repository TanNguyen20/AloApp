const {mulMgToObject, mongooseToObject} = require('../../util/mongoose');
const Account = require('../models/account');
const Message = require('../models/messages');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
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
    async createGroup(req, res, next) {
        var groupName = req.body.groupName;
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        //co thoi gian sua lai them avatar khi tao group
        var avatarGroup = 'https://res.cloudinary.com/dq7zeyepu/image/upload/v1635935296/avatar/owg5qlrubhdfufvwocrw.jpg';
        try{
            var messNew =new Message({avatarGroup:avatarGroup, groupName: groupName, statusDelete: false,friendInGroup:[]});
            messNew.save();
            console.log(messNew._id);
            var idMess = await messNew._id;
            var accUpdate = await Account.findByIdAndUpdate(dataToken._id,{$push: {arrayIdChatGroup: {_id: idMess}}});
            if(accUpdate) res.send('thanhcong');
            else res.send('thatbai');

        }
        catch(err){
            console.log('co loi khi tao group moi: ',err);
        }
    }
    async addMember(req, res, next) {
        var idMember = req.body.idMember;
        var idMess = req.body.idMess;
        var mess = await Message.findById(idMess);
        var existMember =false;
        existMember  = mess.friendInGroup.filter(element => (element._id.toString() == idMember));
        if(existMember.length>0){
            res.send('datontai');
        }
        else{
            var toInsert = {statusDelete:false,_id:idMember};
            var messUpdate = await Message.updateOne({_id: idMess},{$push: {friendInGroup: toInsert}});
            if(messUpdate){
                var inforAddToGroup = await Account.findById(idMember);
                var accUpdate = await Account.updateOne({_id: idMember},{$push: {arrayIdChatGroup: {_id: idMess}}});
                if(accUpdate){
                    res.send({displayName: inforAddToGroup.displayName, avatar: inforAddToGroup.avatar, idFriend: inforAddToGroup._id});
                }
                
            }
            else{
                res.send('thatbai');
            }
        }
    }
    async deleteChat(req, res, next) {
        var idMess = req.body.idMess;
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        try{
            var acc = await Account.findById(dataToken._id);
            var existMess = acc.arrayIdChat1v1.filter(element => (element._id.toString() == idMess));
            if(existMess.length>0){
                var accUpdate = await Account.updateOne({_id: dataToken._id},{$pull: {arrayIdChat1v1: {_id: idMess}}});
                res.send('xoathanhcong');
            }
            else{
                res.send('thatbai');
            }
            
        }
        catch(err){
            console.log('co loi khi xoa chat: ',err);
        }

    }
    async deleteGroupChat(req, res, next) {
        var idMess = req.body.idMess;
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        try{
            var acc = await Account.findById(dataToken._id);
            var existMess = acc.arrayIdChatGroup.filter(element => (element._id.toString() == idMess));
            if(existMess.length>0){
                var messDelete = await Message.findByIdAndDelete(idMess);
                var accUpdate = await Account.updateOne({_id: dataToken._id},{$pull: {arrayIdChatGroup: {_id: idMess}}});
                if(messDelete && accUpdate) res.send('xoathanhcong');
                else res.send('thatbai');
            }
            else{
                res.send('thatbai');
            }
            
        }
        catch(err){
            console.log('co loi khi xoa chat: ',err);
        }

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
    async sendAccessToken(req, res, next) {
        console.log(req.body.idMess);
        const AccessToken = require('twilio').jwt.AccessToken;
        const VideoGrant = AccessToken.VideoGrant;
        const videoGrant = new VideoGrant({
            room: req.body.idMess,
          });          
        // Used when generating any kind of tokens
        const twilioAccountSid = accountSid;
        const twilioApiKey = process.env.TWILIO_API_KEY_VIDEO;
        const twilioApiSecret = process.env.TWILIO_API_SECRET_VIDEO;
        const identity = req.body.idMember;
        // Create an access token which we will sign and return to the client,
        // containing the grant we just created
        const token = new AccessToken(
            twilioAccountSid,
            twilioApiKey,
            twilioApiSecret,
            {identity: identity}
        );
        token.addGrant(videoGrant);
        // Serialize the token to a JWT string
        // console.log(token.toJwt());
        res.send(token.toJwt());
        
    }
    async test(req, res, next) {
        res.render('test');
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

        if(lastChat) {
            // console.log(lastChat._id);
            if(lastChat._id){
                listMediaInLastChat = lastChat._id.arrayContent1v1.filter(element => (element.typeMess=='image' || element.typeMess=='video'));
                listDocument = lastChat._id.arrayContent1v1.filter(element => (element.typeMess=='document'));
                arrContentLastChat=lastChat._id.arrayContent1v1;
            }
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
            if(lastChat) {
                if(lastChat._id) idMessLastChat = lastChat._id._id;
            }
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
                    listDocument,
                    noHeader: true
                });
            }
            else{
                res.render('chat',{
                    user: mongooseToObject(acc),
                    friend:null,
                    isSocialAccount,
                    arrContentChat: arrContentLastChat,
                    you,
                    listChat,
                    noHeader: true
                });
            }
        }
        else{
            res.render('chat');
        }
    }
    // chat1v1(req, res, next) {
    //     var idChat1v1 = req.params.idChat1v1;
    //     res.json(req.params.idChat1v1);
    // }
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
        var acc = await Account.findById(dataToken._id).populate('arrayIdChatGroup._id');
        var existFriend = acc.friends.length;
        var existGroup = acc.arrayIdChatGroup.length;
        var haveFriend = false;
        var haveGroup = false;
        var lastChat = {};
        var listMember = [];
        if(existFriend>0) haveFriend = true;
        if(existGroup>0) {
            haveGroup = true;
            lastChat = acc.arrayIdChatGroup[acc.arrayIdChatGroup.length-1];
        }
        var isSocialAccount =false;
        var listChat = acc.arrayIdChatGroup;
        var arrContentLastChat = [];
        var listMediaInLastChat = [];
        var listDocument = [];
        var groupNameLastChat = '';
        var avatarLastChat = '';
        var friendInGroupLastChat = [];
        // console.log('cc');
        if(lastChat) {
            if(lastChat._id){
                listMediaInLastChat = lastChat._id.arrayContentGroup.filter(element => (element.typeMess=='image' || element.typeMess=='video'));
                listDocument = lastChat._id.arrayContentGroup.filter(element => (element.typeMess=='document'));
                arrContentLastChat=lastChat._id.arrayContentGroup;
                var messFind = await Message.findById(lastChat._id._id).populate('friendInGroup._id')
                groupNameLastChat = messFind.groupName;
                avatarLastChat = messFind.avatarGroup;
                // console.log(messFind);
                listMember = messFind.friendInGroup;
                console.log(listMember);
            }
        }
        var you = acc.displayName;
        // console.log(lastChat._id._id);
        if(acc.googleId!='' || acc.facebookId!='') isSocialAccount = true;

        if(acc){
            // console.log(infoFriendLastChat);
            var idMessLastChat ='';
            if(lastChat) {
                if(lastChat._id) idMessLastChat = lastChat._id._id;
            }
            if(haveFriend){
                // console.log(Object.keys(lastChat).length === 0);
                if(Object.keys(lastChat).length == 0){
                    res.render('groupChat',{
                        user: mongooseToObject(acc),
                        existFriend: haveFriend,
                        existGroup: haveGroup,
                        isSocialAccount,
                        arrContentChat: arrContentLastChat,
                        idMessLastChat,
                        you,
                        listMediaInLastChat,
                        listDocument,
                        noHeader: true,
                    });
                }
                else{
                    res.render('groupChat',{
                        user: mongooseToObject(acc),
                        existFriend: haveFriend,
                        existGroup: haveGroup,
                        isSocialAccount,
                        arrContentChat: arrContentLastChat,
                        idMessLastChat,
                        you,
                        listChat,
                        listMediaInLastChat,
                        listDocument,
                        noHeader: true,
                        lastChat:mongooseToObject(lastChat),
                        listMember,
                        groupNameLastChat,
                        avatarLastChat
                    });
                }
            }
            else{
                res.render('groupChat',{
                    user: mongooseToObject(acc),
                    friend:null,
                    isSocialAccount,
                    arrContentChat: arrContentLastChat,
                    you,
                    listChat,
                    noHeader: true
                });
            }
        }
        else{
            res.render('chat');
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
