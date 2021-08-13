
// const { mutipleMongooseToObject } = require('../../util/mongoose');
// const Cource = require('../models/Cource')

//const {MongooseToObject} = require('../../util/mongoose')
class SiteControllers {
    homePage(req, res, next) {
        res.render('home');
    }
    registers(req, res, next) {
        res.render('signUp');
    }
    login(req, res, next) {
        res.render('signIn');
    }
}

module.exports = new SiteControllers();
