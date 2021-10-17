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
// If they join the base link, generate a random UUID and send them to a new room with said UUID
// app.get('/videoCall', (req, res) => {
//     res.redirect(`/${uuidV4()}`)
// })
// If they join a specific room, then render that room
// app.get('/:room', (req, res) => {
//     res.render('videoChat/room', {roomId: req.params.room})
// })

// app.get('/', (req, res) => {
//         res.render('signIn')
//      })

// When someone connects to the server
//#
//////////nay dung cho chat video hoac voice chat
// io.on('connection', socket => {
//     // When someone attempts to join the room
//     socket.on('join-room', (roomId, userId) => {
//         socket.join(roomId)  // Join the room
//         socket.broadcast.emit('user-connected', userId) // Tell everyone else in the room that we joined

//         // Communicate the disconnection
//         socket.on('disconnect', () => {
//             socket.broadcast.emit('user-disconnected', userId)
//         })
//     })
// });
//#
const mainServer = serverHttp.listen(portHttp); // Run the server on the 3000 port
server.listen(portHttps); // Run the server on the 3443 port
//
const io = require('socket.io')(mainServer);
io.on('connection', function (socket) {
    console.log(`...........................Welcome socket ${socket.id}...........................`);
    socket.on("disconnect", (reason) => {
      console.log(`...........................Socket ${socket.id} exit because ${reason}...........................`);
    });
    socket.on('joinroom',(data)=>{
      socket.join(data);
      console.log(`...........................socket ${socket.id} has joined room ${data}...........................`);
    });
    //luu vao db
    var from = "";
    var content = "";
    var to="";
    socket.on('receiver',(data)=>{
        // console.log(JSON.stringify(data)+'....');
        var notify={};
        notify.from = data.from;
        notify.to = data.to;
        notify.typeNotification ='tin nhắn';
        var notificationSave = new notification(notify);
        notificationSave.save()
        .then(()=>{
            console.log('Created notify sucess!!!');
        })
        .catch((err)=>{
            console.log('Co loi xay ra trong khi tao thong bao, thong tin loi: '+err);
        })
        console.log(JSON.stringify(data)+'....');
        var  messageSave= new message(data);
        messageSave.save()
        .then(()=>{
            console.log("Created message and save into database!!!")
        })
        .catch((err)=>{
            console.log("Co loi xay ra, thong tin loi: "+ err);
        })
    });
    socket.on('send', function (data) {
        const roomSize = io.of("/").adapter.rooms.get(data.usernameUrl);
        data.size = roomSize.size;
        console.log(`...........................room size: ${roomSize.size}...........................`);
        io.sockets.emit('send', data);//gui data qua socket
    });
    // socket.on("someevent", (data) => {// someevent =  send
    //   console.log(data.username+"#....................");
    //   io.sockets.emit('someevent', data);//gui data di
    // });
});
//
app.use(cookieParser('mk'));
route(app);
