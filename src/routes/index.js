const siteRouter = require('./site');
const meRouter = require('./me');
const chatRouter = require('./chat');
const loginRouter = require('./login');
const registerRouter = require('./register');
const verifyRouter = require('./verify');
const aboutRouter = require('./about');
const authRouter = require('./auth');
const findFriendsRouter = require('./findFriends');
function route(app) {
    app.use('/login', loginRouter);
    app.use('/findFriends', findFriendsRouter);
    app.use('/auth', authRouter);
    app.use('/verify', verifyRouter);
    app.use('/register', registerRouter);
    app.use('/me',meRouter);
    app.use('/chat',chatRouter);
    app.use('/about',aboutRouter);
    app.use('/', siteRouter);
    app.use('*',function(req, res){
        res.status(404).send(`
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            <img class="rounded mx-auto d-block" width="600px" height="auto" src="https://res.cloudinary.com/dq7zeyepu/image/upload/v1638012336/background/2456051_jir9gr.jpg"/>
            `
        );
    });
}

module.exports = route;
