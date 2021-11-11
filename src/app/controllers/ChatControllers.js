const {v4: uuidV4} = require('uuid');
const Account = require('../models/account');
const Messages = require('../models/messages');
const jwt = require('jsonwebtoken');
const {mulMgToObject, mongooseToObject} = require('../../util/mongoose');
class ChatControllers {
    async checkMess(req, res){
        var idFriend = req.body.idFriend;
        var token = req.cookies.token;
        var decode = jwt.verify(token,'mk');
        var yourAcc = await Account.findById(decode._id);
        var arrChat1v1 = yourAcc.arrayIdChat1v1;
        var exisMess = arrChat1v1.some( item => item['idFriend'].toString() == idFriend);
        if(exisMess){
            //populate lay data render ra
            var mess = await Account.findOne({_id: decode._id}).populate('arrayIdChat1v1._id').populate('arrayIdChat1v1.idFriend');
            var arrChat1v1 = mess.arrayIdChat1v1;
            console.log(mess);
            // trong arrChat1v1 chua nhieu doan chat voi nhieu nguoi nen phai find ra 
            // nguoi co idFriend trung voi idFriend trong req.body
            var item = arrChat1v1.find(item => item.idFriend._id.toString() == idFriend);
            var dataSend = mongooseToObject(item);
            dataSend.idFriend = {displayName: item.idFriend.displayName, avatar: item.idFriend.avatar, idFriend: item.idFriend._id};
            res.send(dataSend);
        }
        else{
            // them moi va add id Messanges nay vao arrayIdChat1v1
            var arrayContent1v1 = [];
            var messages = new Messages(arrayContent1v1);
            try{
                var newMess = await messages.save();
                var findFriend = await Account.findById(idFriend);
                var idMess = newMess._id;
                var friend = mongooseToObject(findFriend);
                var dataFriend = {'displayName': friend.displayName, 'avatar': friend.avatar, 'idFriend': idFriend, 'idMess': idMess, 'statusMess':'taomoi'};
                var accUpdate = await Account.findByIdAndUpdate(decode._id, {$push: {arrayIdChat1v1: {_id: idMess, idFriend: idFriend}}});
                res.send(dataFriend);
            }
            catch(err){
                console.log(err);
            }

        }
    }
    async checkGroup(req, res){
        var idMess = req.body.idMess;
        var infoMessGroup = await Messages.findById(idMess).populate('friendInGroup._id');
        var dataSend = {};
        var listFriendLInGroup = [];
        var temp={};
        if(infoMessGroup){
            console.log(infoMessGroup);
            dataSend['contentChatGroup'] = infoMessGroup.arrayContentGroup;
            dataSend['groupName'] = infoMessGroup.groupName;
            dataSend['avatarGroup'] = infoMessGroup.avatarGroup;
            dataSend['idGroup'] = infoMessGroup._id;
            for(var element of infoMessGroup.friendInGroup){
                temp = {'displayName': element._id.displayName, 'avatar': element._id.avatar, 'idFriend': element._id._id};
                listFriendLInGroup.push(temp);
            }
            dataSend['infoFriend'] = listFriendLInGroup;
            console.log(dataSend);
            res.send(dataSend);
        }
        else{
            res.send('id not found');
        }
    }
}

module.exports = new ChatControllers();
