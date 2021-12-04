//Create our express and socket.io servers
const express = require('express');
const app = express();
require('dotenv').config();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const route = require('./routes');
const path = require('path');
const morgan = require('morgan');
const Messages = require('./app/models/messages');
const Account = require('./app/models/account');
const bodyParser = require('body-parser');
const passport = require('passport');
const methodOverride = require('method-override');
require('./config/passport')(passport);
const fs = require('fs');
var httpsOptions = {
    key: fs.readFileSync('./src/app/cert/server.key')
    , cert: fs.readFileSync('./src/app/cert/server.crt')
};
const serverHttp = require('http').Server(app);
const server = require('https').Server(httpsOptions, app);
// dong ben duoi dung cho video chat hoac voice chat
// const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const handlebars = require('express-handlebars');
const portHttp = process.env.PORT || 3000;
const portHttps = process.env.SECURE_PORT || 3443;
const MONGO_STRING_CONNECT_CLUSTER = process.env.MONGO_STRING_CONNECT_CLUSTER;
const db = require('./config/db');
app.use(methodOverride('_method'));
db.connect();
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            renderMessages: (mess,username)=>{
                var strMess='';
                for(var i=0;i<mess.length;i++){
                    if(mess[i].from==username){
                        strMess+=`<p class='message__container'>
                        <span class='content-message' style='background-color:blue;'> ${mess[i].content}</span> :Bạn</p><br>`;
                    }
                    else{
                        strMess+=`<p class='message__container-1'>${mess[i].from}: <span class='content-message-1'> ${mess[i].content} </span></p><br>`;
                    }
                }
                return strMess;
            },
            renderFindFriendWithFacebook:(listFriends)=>{
                var strTotal=`<div class="row mb-lg-4 mb-md-4 mb-0 mb-sm-0">`;
                listFriends.forEach(function (friend, i) {
                    strTotal+=`<div class="friendItems d-flex align-items-center col-md-6 mb-lg-0 mb-md-0 mb-sm-4 mb-4 justify-content-between">
                                <div class="d-flex align-items-center">
                                    <img src="${friend.avatar}" alt="" style="width:80px;height:80px;" class="rounded">
                                    <div class="ms-3">
                                        <div class="displayName">
                                            ${friend.displayName}
                                        </div>`;
                    if(friend.statusFriend == 0){
                        strTotal+=`<div class="statusFriend">
                                        Chưa là bạn bè
                                    </div>
                                </div>
                            </div>
                            <div class="btnRequestAddFriend" id="${friend._id}">
                                <i class="fas fa-user-plus cursor"></i>
                            </div>
                        </div>`;
                    }
                    else if(friend.statusFriend == 2){
                        strTotal+=`<div class="statusFriend">
                                        Đã gửi yêu cầu kết bạn
                                    </div>
                                </div>
                            </div>
                            <i class="fas fa-user-clock"></i>
                        </div>`;
                    }
                    else{
                        strTotal+=`<div class="statusFriend">
                                        Đã là bạn bè
                                    </div>
                                </div>
                            </div>
                            <i class="fas fa-user-check"></i>
                        </div>`;
                    }

                    if(i%2!=0 && i!=listFriends.length-1){
                        strTotal+=`</div>`;
                        strTotal+=`<div class="row mb-lg-4 mb-md-4 mb-0 mb-sm-0">`;
                    }
                    else if(i==listFriends.length-1){
                        strTotal+=`</div>`;
                    }
                });
                return strTotal;
            },
            renderListFriends: (listFriends)=>{
                var strTotal=``;
                if(listFriends.length>0) strTotal=`<div class="row mb-4">`;
                listFriends.forEach(function (friend, i) {
                    
                    if(i%2==0 && i!=listFriends.length-1){
                        strTotal+=`<div class="friendItems mb-4 mb-md-0 mb-lg-0 d-flex align-items-center col-md-6 justify-content-between">
                            <div class="d-flex align-items-center">
                                <img src="${friend.avatar}" alt="" style="width:80px;height:80px;" class="rounded">
                                <div class="ms-3">
                                    <div class="displayName">
                                        ${friend.displayName}
                                    </div>
                                    <div class="statusOnline">
                                        Bạn bè
                                    </div>
                                </div>
                            </div>
                            <div class="wrapDeleteFriend">
                                <i class="fas fa-ellipsis-h iconTripleDotted cursor"></i>
                                <div id=${friend._id} class="btnDeleteFriend cursor dropdownHidden fw-bold text-danger">Xóa bạn</div>
                            </div>
                        </div>`;
                    }
                    else if(i%2==0 && i==listFriends.length-1){
                        strTotal+=`<div class="friendItems mb-4 mb-md-0 mb-lg-0 d-flex align-items-center col-md-6 justify-content-between">
                            <div class="d-flex align-items-center">
                                <img src="${friend.avatar}" alt="" style="width:80px;height:80px;" class="rounded">
                                <div class="ms-3">
                                    <div class="displayName">
                                        ${friend.displayName}
                                    </div>
                                    <div class="statusOnline">
                                        Bạn bè
                                    </div>
                                </div>
                            </div>
                            <div class="wrapDeleteFriend">
                                <i class="fas fa-ellipsis-h iconTripleDotted cursor"></i>
                                <div id=${friend._id} class="btnDeleteFriend cursor dropdownHidden fw-bold text-danger">Xóa bạn</div>
                            </div>
                        </div>
                        </div>`;
                    }
                    else if(i==listFriends.length-1){
                        strTotal+=`<div class="friendItems d-flex align-items-center col-md-6 justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <img src="${friend.avatar}" alt="" style="width:80px;height:80px;" class="rounded">
                                        <div class="ms-3">
                                            <div class="displayName">
                                                ${friend.displayName}
                                            </div>
                                            <div class="statusOnline">
                                                Bạn bè
                                            </div>
                                        </div>
                                    </div>
                                    <div class="wrapDeleteFriend">
                                        <i class="fas fa-ellipsis-h iconTripleDotted cursor"></i>
                                        <div id=${friend._id} class="btnDeleteFriend cursor dropdownHidden fw-bold text-danger">Xóa bạn</div>
                                    </div>
                                </div>
                            </div>`;
                    }
                    else{
                        strTotal+=`<div class="friendItems d-flex align-items-center col-md-6 justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <img src="${friend.avatar}" alt="" style="width:80px;height:80px;" class="rounded">
                                        <div class="ms-3">
                                            <div class="displayName">
                                                ${friend.displayName}
                                            </div>
                                            <div class="statusOnline">
                                                Bạn bè
                                            </div>
                                        </div>
                                    </div>
                                    <div class="wrapDeleteFriend">
                                        <i class="fas fa-ellipsis-h iconTripleDotted cursor"></i>
                                        <div id=${friend._id} class="btnDeleteFriend cursor dropdownHidden fw-bold text-danger">Xóa bạn</div>
                                    </div>
                                </div>
                            </div>`;
                        strTotal+=`<div class="row mb-4">`;
                    }
                    
                });
                return strTotal;
            },
            renderRequestFriends: (listRequest)=>{
                var strTotal=``;
                listRequest.forEach(function (request, i) {
                    strTotal+=`<div class="mb-4 friendItems">
                                    <div class="d-flex justify-content-md-evenly justify-content-lg-start">
                                        <img src="${request.avatar}" alt="hinh anh" style="width:80px;height:80px;" class="rounded">
                                        <div class="ms-3">
                                            <div class="displayName">
                                                ${request.displayName}
                                            </div>
                                            <div class="d-flex wrapBtnRequest">
                                                <button type="submit" class="btnAccept btn btn-primary mt-3 me-3" id="${request._id}">Chấp nhận</button>
                                                <button type="button" class="btnDelete btn btn-secondary mt-3" id1="${request._id}">Xóa lời mời</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                });
                return strTotal;
            },
            renderContentLastChat:(arrChat,you)=>{
                var totalStr =``;
                var idElement=0;
                for(var element of arrChat){
                    if(element.from==you){
                        var contentFormat =``;
                        if(element.typeMess=='image' || element.typeMess=='video'){
                            contentFormat=`<span class='content-message' style='background-color:rgb(0, 66, 233);'>${element.content}</span> :Bạn`;
                        }
                        else contentFormat=`<span class='content-message' style='background-color:rgb(0, 66, 233);'>${element.content}</span> :Bạn`;
                        totalStr+=`<p class='message__container'>
                                    ${contentFormat}
                                    <i class="fas fa-backspace d-none iconDeleteMessage cursor" id='${idElement}'></i>
                                </p>
                                <br>`;
                    }
                    else{
                        totalStr+=` <p class='message__container-1'>${element.from} :
                                    <span class='content-message-1'>${element.content}</span>
                                    <br>
                                    <i class="fas fa-backspace d-none iconDeleteMessage cursor" id='${idElement}'></i>
                                </p><br>`
                    }
                    idElement++;
                }
                return totalStr;
            },
            renderCol1: (listChat)=>{
                var totalStr =``;
                for(var element of listChat){
                    totalStr+=`<div class="wrapPreview d-flex align-items-center justify-content-between mb-2" id=${element.idFriend._id}>
                                    <div class="logoAndMessagePreview ms-2 d-flex mt-1">
                                        <img src="${element.idFriend.avatar}" alt="logoGroup" class="avatarCol1 rounded-circle">
                                        <div class="">
                                            <h6>${element.idFriend.displayName}</h6>
                                            <span>Trò chuyện ngay nào!</span>
                                        </div>
                                    </div>
                                    <div class="detailAndStatusMessenge d-flex">
                                        <div class="me-2">
                                            <i class="fas fa-ellipsis-h border rounded-circle p-1 backGroundWhite"> </i>
                                        </div>
                                        <div class="">
                                            <i class="far fa-check-circle"></i>
                                        </div>
                                    </div>
                                </div>`;
                }
                return totalStr;

            },
            renderCol1GroupChat: (listChat)=>{
                var totalStr =``;
                if(listChat.length>0){
                    // console.log(listChat);
                    for(var element of listChat){
                        totalStr+=`<div class="wrapPreview d-flex align-items-center justify-content-between mb-2" id=${element._id._id}>
                                        <div class="logoAndMessagePreview ms-2 d-flex mt-1">
                                            <img src="${element._id.avatarGroup}" alt="logoGroup" class="avatarCol1 rounded-circle">
                                            <div class="">
                                                <h6>${element._id.groupName}</h6>
                                                <span>Trò chuyện ngay nào!</span>
                                            </div>
                                        </div>
                                        <div class="detailAndStatusMessenge d-flex">
                                            <div class="me-2">
                                                <i class="fas fa-ellipsis-h border rounded-circle p-1 backGroundWhite"> </i>
                                            </div>
                                            <div class="">
                                                <i class="far fa-check-circle"></i>
                                            </div>
                                        </div>
                                    </div>`;
                    }
                }
                return totalStr;

            },
            renderListMediaLastChat: (listMedia)=>{
                var totalStr =``;
                for(var element of listMedia){
                    if(element.typeMess=='image'){
                        var split1 =element.content.split('href=')[1];
                        var link =``;
                        console.log(element.content);
                        if(split1) link = split1.split(' target="_blank"');
                        var classAndIdfile=``;
                        if(link[1].indexOf('idfile')>=0){
                            classAndIdfile = ``+link[1].split('style="font-weight: bold;"')[1];
                            classAndIdfile = classAndIdfile.split('>')[0];
                            console.log(classAndIdfile);
                        }
                        if(element.content.indexOf('img')>=0){
                            totalStr+=element.content;
                        }
                        else{
                            totalStr+=`<a href=${link[0]} target="_blank">
                                <img src=${link[0]} width="50px" height="50px" ${classAndIdfile}">
                            </a>`;
                        }
                    }
                    else{
                        totalStr+=`${element.content.replace('text-white','text-primary')}`;
                    }
                }

                return totalStr;
            },
            renderListDocument: (listDocument)=>{
                var totalStr =``;
                for(var element of listDocument){
                    totalStr+=`<div>${element.content.replace('text-white','text-primary')}</div>`;
                }
                return totalStr;
            },
            renderListMember: (listMember)=>{
                var totalStr =``;
                for(var element of listMember){
                    totalStr+=`<div class="d-flex align-items-center justify-content-between mb-2 mt-2 wrapMember" idMember="${element._id._id}">
                                    <div class="d-flex justify-content-start align-items-center">
                                        <img src="${element._id.avatar}" alt="anh dai dien" class="avatarMe rounded-circle me-2">${element._id.displayName}
                                    </div>
                                    <div class="btnDeleteMember cursor">
                                        <i class="fas fa-sign-out-alt rounded-circle p-1 backGroundWhite" id="${element._id._id}"></i>
                                    </div>
                                </div>`;
                }   
                return totalStr;

            }
        }
    }),
);
//tao session cho fb va google
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: MONGO_STRING_CONNECT_CLUSTER,
            mongoOptions: { useUnifiedTopology: true }
        }),

    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//
app.use(morgan('combined'));
app.set('view engine', 'hbs'); // Tell Express we are using hbs
app.use(express.json());//json parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public/')));
app.set('views', path.join(__dirname, 'resources/views'));
app.use('/scriptsLibary', express.static(path.join(__dirname, '/../node_modules')));

///---socket io---///

const mainServer = serverHttp.listen(portHttp); // Run the server on the 3000 port
const serverHttps = server.listen(portHttps); // Run the server on the 3443 port
//
//khi socket io chay tren https se bi loi hien thi khi gui hinh anh
const io = require('socket.io')(portHttp);
io.on('connection', function (socket) {
    console.log(`...........................Welcome socket ${socket.id}...........................`);
    socket.on("disconnect", (reason) => {
        console.log(`...........................Socket ${socket.id} exit because ${reason}...........................`);
    });
    socket.on('joinroom',(idRoom)=>{
      socket.join(idRoom);
      console.log(`...........................socket ${socket.id} has joined room ${idRoom}...........................`);
    });
    ////
    socket.on('sendRoomSize',function(data){
        console.log('nhan id room :', data)
        var roomSize = io.of("/").adapter.rooms.get(data);
        console.log('roomsize: ', roomSize.size);
        socket.emit('roomSize',roomSize.size);
    });
    socket.on('send',async function (data) {
        console.log(data);
        const roomSize = io.of("/").adapter.rooms.get(data.idRoom);
        var idYou = data.idRoom.split(data.idFriend);
        idYou = idYou[0]+idYou[1];
        var dataMessSave = {from: data.from, to: data.to, content: data.content, typeMess: data.typeMess};
        console.log(roomSize);
        try{
            var yourMessUpdate = await Messages.findByIdAndUpdate(data.idMess, {$push: {arrayContent1v1: dataMessSave}});
            var acc = await Account.findById(data.idFriend);
            var messFriend = acc.arrayIdChat1v1.find(item => item.idFriend.toString() == idYou);
            //console.log(messFriend);
            var existMessFriend = acc.arrayIdChat1v1.some( item => item.idFriend.toString() == data.idFriend);
            if(messFriend){
                var messFriendUpdate = await Messages.findByIdAndUpdate(messFriend._id, {$push: {arrayContent1v1: dataMessSave}});
                // console.log(messFriendUpdate);
            }
            else{
                //tao moi
                var messFriendSave = await new Messages({arrayContent1v1: dataMessSave});
                var messSaveIntoDb = await messFriendSave.save();
                console.log(messSaveIntoDb);
                var idMessFriend = messFriendSave._id;
                var accFriendUpdate = await Account.findByIdAndUpdate(data.idFriend, {$push: {arrayIdChat1v1: {idFriend: idYou, _id: idMessFriend}}});
                console.log(accFriendUpdate);
            }
        }
        catch(err){
            console.log('co loi khi luu messages, thong tin loi: \n'+err);
        }
        data.size = roomSize.size;
        console.log(`...........................room size: ${roomSize.size}...........................`);
        io.sockets.in(data.idRoom).emit('send', data);//gui data qua socket
    });
    socket.on('sendGroup',async function (data) {
        console.log(data);
        const roomSize = io.of("/").adapter.rooms.get(data.idMess);
        var dataMessSave = {from: data.from, to: data.to, content: data.content, typeMess: data.typeMess};
        console.log(roomSize);
        try{
            var messSave = await Messages.findByIdAndUpdate(data.idMess, {$push: {arrayContentGroup: dataMessSave}});
            if(messSave){
                console.log('messages save');
            }
            else{ 
                console.log('co loi xay ra trong khi luu tin nhan');
            }
        }
        catch(err){
            console.log('co loi khi luu messages, thong tin loi: \n'+err);
        }
        data.size = roomSize.size;
        console.log(`...........................room size: ${roomSize.size}...........................`);
        io.sockets.in(data.idMess).emit('sendGroup', data);//gui data qua socket
    });
    socket.on('videoCallGroup',function(idMess){
        socket.broadcast.emit('videoCallGroup',idMess);
    });
    socket.on('voiceCallGroup',function(idMess){
        socket.broadcast.emit('voiceCallGroup',idMess);
    });
    socket.on('deleteMessage',function(data){
        socket.broadcast.emit('deleteMessage',data);
    });
});
//
app.use(cookieParser('mk'));
route(app);
