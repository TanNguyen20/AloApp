const Account = require('../models/account');
// const messages = require('../models/messages');
const jwt = require('jsonwebtoken');
const {mulMgToObject, mongooseToObject} = require('../../util/mongoose');

class FindFriendsControllers {
    //status=2 dang cho duoc dong y, bang 1 da ket ban, bang 0 chua ket ban
    async findFriends(req, res, next){
        var token = req.cookies.token;
        var dataToken = jwt.verify(token,'mk');
        var acc = await Account.findById(dataToken._id);
        var isSocialAccount =false;
        if(acc.googleId!='' || acc.facebookId!='') isSocialAccount = true;
        if(acc){
            res.render('findFriends',{
                user: mongooseToObject(acc),
                isSocialAccount
            });
        }
        else{
            res.send('Khong tim thay thong tin tai khoan');
        }
    }
    async sendRequestFriends(req, res, next) {
        try{
            var idRequestFriend = req.body.idRequestFriend;
            console.log(idRequestFriend);
            var infoSendRequestFriend = await Account.findById(idRequestFriend);
            var user1 = {};
            user1 =idRequestFriend;
            // user1.displayNameRequestFriend = infoSendRequestFriend.displayName;
            // user1.avatarRequestFriend = infoSendRequestFriend.avatar;
            // user1.statusRequestFriend = 2;
            var token = req.cookies.token;
            var decode = jwt.verify(token,'mk');
            var yourAcc = await Account.findById(decode._id);
            var user2={};
            user2=decode._id;
            // user2.displayNameWaitAcceptFriend=yourAcc.displayName;
            // user2.avatarWaitAcceptFriend=yourAcc.avatar;
            // user2.statusWaitAcceptFriend=2;
            var isRequestFriends = yourAcc.requestFriends.some( item => item.toString() == idRequestFriend);
            if(!isRequestFriends){
                var yourAccUpdate  =  await Account.findByIdAndUpdate(decode._id, {$push: {requestFriends: user1}});
                var anotherAccUpdate = await Account.findByIdAndUpdate(idRequestFriend, {$push: {waitAcceptFriends: user2}});
                console.log(idRequestFriend);
                res.send('1');
            }
            else{
                res.send('0');
            }
        }
        catch(err){
            console.log('Co loi khi gui yeu cau ket ban:', err);
            res.send('co loi xay ra');
        }
    }
    async chat1v1(req, res){
        // console.log(req.body);
        var findFriends = req.body.findFriends;
        if(findFriends==''){
            res.send([]);
        }
        else{
            var regexFindFriends = new RegExp(findFriends, "i");
            var token = req.cookies.token;
            var decode = jwt.verify(token,'mk');
            try {

                var yourAcc = await Account.findById(decode._id).populate('friends');
                console.log(yourAcc);
                //console.log(yourAcc.populate('messages.arrayIdChat1v1'));
                var listFriends =  yourAcc.friends;
                var arr=[];
                for(var element of listFriends){
                    console.log(element.displayNameFriend);
                    if(element.displayName.match(regexFindFriends)){
                        arr.push(element);
                    }
                }
                res.send(arr);
                console.log(arr);
            } catch (error) {
                console.log('thong tin loi: ',error);
            }
        }
    }
    async defaultFindFriends(req, res, next) {
        // console.log(req.body);
        var findFriends = req.body.findFriends;
        var regexFindFriends = new RegExp(findFriends, "i");
        var token = req.cookies.token;
        var decode = jwt.verify(token,'mk');
        try {
            var listFind = await Account.find({displayName: regexFindFriends});
            var yourAcc = await Account.findById(decode._id);
            console.log(yourAcc);
            var arr=[];
            for(var element of listFind){
                // can phai co status tinh trang ban be status=0 chua la ban, status = 1 da la ban

                var dataAppend = {idFriend: element._id,displayNameFriend: element.displayName,avatarFriend: element.avatar};
                var isFriend = yourAcc.friends.some( item => item.toString() == element._id);
                var isRequestFriends = yourAcc.requestFriends.some( item => item.toString() == element._id);
                // console.log(isFriend);
                if(element._id.toString() != decode._id){
                    if(isFriend){
                        dataAppend['statusFriend'] = 1;
                        arr.push(dataAppend);
                    }
                    else{
                        if(isRequestFriends){
                            dataAppend['statusFriend'] = 2;
                        }
                        else{
                            dataAppend['statusFriend'] = 0;
                        }
                        arr.push(dataAppend);
                    }
                }
            }
            res.send(arr);
            console.log(arr);
        } catch (error) {
            console.log('thong tin loi: ',error);
        }
    }
    async facebookFindFriends(req, res, next) {
        var acc = await Account.find({});
        var listAccFacebook = [];
        var token = req.cookies.token;
        var decode = jwt.verify(token,'mk');
        var accToken = await Account.findById(decode._id);
        for(var element of acc){
            if(element.facebookId.toString() != '' && element._id.toString() != decode._id){
                var isFriend = element.friends.some( item => item.toString() == decode._id);
                var isRequestFriends = element.waitAcceptFriends.some( item => item.toString() == decode._id);
                var newelement = {...element._doc};
                // console.log(decode._id)
                if(isFriend){
                    newelement['statusFriend'] = 1;
                    listAccFacebook.push(newelement);
                }
                else{
                    if(isRequestFriends){
                        newelement['statusFriend'] = 2;
                    }
                    else{
                        newelement['statusFriend'] = 0;
                    }
                    // console.log(newelement);
                    listAccFacebook.push(newelement);
                }
            }
        }
        // console.log(listAccFacebook);
        var isSocialAccount =false;
        if(acc.googleId!='' || acc.facebookId!='') isSocialAccount = true;
        if(acc){
            res.render('findFriends',{
                user: mongooseToObject(accToken),
                isSocialAccount,
                listUserFacebook: listAccFacebook
            });
        }
        else{
            res.render('findFriends');
        }
        
    }
}

module.exports = new FindFriendsControllers();
