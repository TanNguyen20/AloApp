const siteRouter = require('./site');
const meRouter = require('./me');
const chatRouter = require('./chat');
const loginRouter = require('./login');
const registerRouter = require('./register');
function route(app) {
    app.use('/login', loginRouter);
    app.use('/register', registerRouter);
    app.use('/me',meRouter)
    app.use('/chat',chatRouter)
    app.use('/', siteRouter);
}

module.exports = route;
