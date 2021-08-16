const siteRouter = require('./site');
const meRouter = require('./me');
function route(app) {
    app.use('/', siteRouter);
    app.use('/me',meRouter)
}

module.exports = route;
