
// const { mutipleMongooseToObject } = require('../../util/mongoose');
// const Cource = require('../models/Cource')

//const {MongooseToObject} = require('../../util/mongoose')
class MeControllers {
    me(req, res, next) {
        res.render('me');
    }
}

module.exports = new MeControllers();
