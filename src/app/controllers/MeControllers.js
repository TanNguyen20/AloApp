
const { mutipleMongooseToObject } = require('../../util/mongoose');
const Cource = require('../models/Cource')
//const {MongooseToObject} = require('../../util/mongoose')
class MeControllers {
    storedCources(req, res,next) {

        Promise.all([Cource.find({}), Cource.countDocumentsDeleted()])
            .then(([cources, deletedCount]) => res.render('me/storedCources',{
                deletedCount,
                cources: mutipleMongooseToObject(cources)
            }))
            .catch(next)
    }

    trashCources(req, res,next)
    {
        Cource.findDeleted({})
        .then(cources => res.render('me/trashCources',{
            cources: mutipleMongooseToObject(cources)
        }))
        .catch(next)
    }

}

module.exports = new MeControllers();
