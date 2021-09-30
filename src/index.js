//Create our express and socket.io servers
const express = require('express');
const app = express();
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const route = require('./routes');
const path = require('path');
const morgan = require('morgan');
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
const io = require('socket.io')(server);
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
        }
    }),
);
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
app.set('view engine', 'hbs') // Tell Express we are using EJS
app.use(express.json())//json parser
app.use(express.urlencoded({ extended: true }))
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
io.on('connection', socket => {
    // When someone attempts to join the room
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)  // Join the room
        socket.broadcast.emit('user-connected', userId) // Tell everyone else in the room that we joined

        // Communicate the disconnection
        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', userId)
        })
    })
});

serverHttp.listen(portHttp); // Run the server on the 3000 port
server.listen(portHttps); // Run the server on the 3443 port
route(app);
