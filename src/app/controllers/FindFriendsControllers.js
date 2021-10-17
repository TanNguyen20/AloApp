const Account = require('../models/account');
const jwt = require('jsonwebtoken');
class FindFriendsControllers {
    //status=2 dang cho duoc dong y, bang 1 da ket ban, bang 0 chua ket ban
    findFriends(req, res, next){
        res.render('findFriends');
    }
    async sendRequestFriends(req, res, next) {
        try{
            var idRequestFriend = req.body.idRequestFriend;
            var infoSendRequestFriend = await Account.findById(idRequestFriend);
            var user1 = {};
            user1.idRequestFriend =idRequestFriend;
            user1.displayNameRequestFriend = infoSendRequestFriend.displayName;
            user1.avatarRequestFriend = infoSendRequestFriend.avatar;
            user1.statusRequestFriend = 2;
            var token = req.cookies.token;
            var decode = jwt.verify(token,'mk');
            var yourAcc = await Account.findById(decode._id);
            var user2={};
            user2.idWaitAcceptFriend=decode._id;
            user2.displayNameWaitAcceptFriend=yourAcc.displayName;
            user2.avatarWaitAcceptFriend=yourAcc.avatar;
            user2.statusWaitAcceptFriend=2;
            var yourAccUpdate  =  await Account.findByIdAndUpdate(decode._id, {$push: {requestFriends: user1}});
            var anotherAccUpdate = await Account.findByIdAndUpdate(idRequestFriend, {$push: {waitAcceptFriends: user2}});
            console.log(idRequestFriend);
            res.send('1');
        }
        catch(err){
            console.log('Co loi khi gui yeu cau ket ban:', err);
            res.send('co loi xay ra');
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
            var arr=[];
            for(var element of listFind){
                // can phai co status tinh trang ban be status=0 chua la ban, status = 1 da la ban

                var dataAppend = {idFriend: element._id,displayNameFriend: element.displayName,avatarFriend: element.avatar};
                var isFriend = yourAcc.friends.some( item => item['idFriend'].toString() == element._id);
                var isRequestFriends = yourAcc.requestFriends.some( item => item['idRequestFriend'].toString() == element._id);
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
    facebookFindFriends(req, res, next) {
        
        res.render('findFriends',{
            userFacebook: 'abc'
        });
        
    }
}

module.exports = new FindFriendsControllers();
