const siteRouter = require('./site');
const meRouter = require('./me');
const chatRouter = require('./chat');
const loginRouter = require('./login');
const registerRouter = require('./register');
const verifyRouter = require('./verify');
const aboutRouter = require('./about');
function route(app) {
    app.use('/login', loginRouter);
    app.use('/verify', verifyRouter);
    app.use('/register', registerRouter);
    app.use('/me',meRouter);
    app.use('/chat',chatRouter);
    app.use('/about',aboutRouter);
    app.use('/', siteRouter);
}

module.exports = route;
