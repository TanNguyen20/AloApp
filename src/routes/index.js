const newsRouter = require('./news');
const siteRouter = require('./site');
const courceRouter = require('./cources');
const meRouter = require('./me');
function route(app) {
    app.use('/me', meRouter);
    app.use('/cources', courceRouter);
    app.use('/new', newsRouter);
    app.use('/', siteRouter);

}

module.exports = route;
