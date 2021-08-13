//Create our express and socket.io servers
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4: uuidV4} = require('uuid');
const handlebars = require('express-handlebars');
const port = 3000;

app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        helpers: {
            sum: (a,b) => a+b,
        }
    }),
);

app.set('view engine', 'hbs') // Tell Express we are using EJS
app.use(express.static(path.join(__dirname, 'public/')));
app.set('views', path.join(__dirname, 'resources/views'));
// If they join the base link, generate a random UUID and send them to a new room with said UUID
// app.get('/', (req, res) => {
//     res.redirect(`/${uuidV4()}`)
// })
// If they join a specific room, then render that room
// app.get('/:room', (req, res) => {
//     res.render('videoChat/room', {roomId: req.params.room})
// })

const route = require('./routes');
route(app);

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
})

//server.listen(3000) // Run the server on the 3000 port
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});