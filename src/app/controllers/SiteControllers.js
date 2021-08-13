
// const { mutipleMongooseToObject } = require('../../util/mongoose');
// const Cource = require('../models/Cource')

//const {MongooseToObject} = require('../../util/mongoose')
class SiteControllers {
    homePage(req, res, next) {
        res.render('home');
    }

}

module.exports = new SiteControllers();
