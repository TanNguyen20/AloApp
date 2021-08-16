const siteRouter = require('./site');
const meRouter = require('./me');
const chatRouter = require('./chat');
function route(app) {
    app.use('/', siteRouter);
    app.use('/me',meRouter)
    app.use('/chat',chatRouter)
}

module.exports = route;
