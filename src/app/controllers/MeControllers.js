
// const { mutipleMongooseToObject } = require('../../util/mongoose');
// const Cource = require('../models/Cource')

//const {MongooseToObject} = require('../../util/mongoose')
class MeControllers {
    chat(req, res, next) {
        res.render('chat');
    }
    profile(req, res, next) {
        res.render('profile');
    }
}

module.exports = new MeControllers();
