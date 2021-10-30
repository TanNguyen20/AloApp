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
            console.log(arrChat1v1);
            // trong arrChat1v1 chua nhieu doan chat voi nhieu nguoi nen phai find ra 
            // nguoi co idFriend trung voi idFriend trong req.body
            var item = arrChat1v1.find(item => item.idFriend._id.toString() == idFriend);
            res.send(item);

        }
        else{
            // them moi va add id Messanges nay vao arrayIdChat1v1
            var arrayContent1v1 = [];
            var messages = new Messages(arrayContent1v1);
            try{
                var newMess = await messages.save();
                var findFriend = await Account.findById(idFriend);
                var idMess = newMess._id;
                // var displayName = findFriend.displayName;
                // var avatar = findFriend.avatar;
                var accUpdate = await Account.findByIdAndUpdate(decode._id, {$push: {arrayIdChat1v1: {_id: idMess, idFriend: idFriend}}});
                res.send(exisMess);
            }
            catch(err){
                console.log(err);
            }

        }
    }
    redirectParamsRoom(req, res, next){
        res.redirect(`/chat/videochat/${uuidV4()}`);
    }
    videoChat(req, res, next) {
        res.render('videoChat/room', {roomId: req.params.room});
    }
}

module.exports = new ChatControllers();
