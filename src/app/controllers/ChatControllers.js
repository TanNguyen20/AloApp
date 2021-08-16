const {v4: uuidV4} = require('uuid');
class ChatControllers {
    
    redirectParamsRoom(req, res, next){
        res.redirect(`/chat/videochat/${uuidV4()}`);
    }
    videoChat(req, res, next) {
        res.render('videoChat/room', {roomId: req.params.room});
    }
}

module.exports = new ChatControllers();
