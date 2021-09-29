// const mongoose = require('mongoose');
// const Schema = mongoose.Schema
// const slug = require('mongoose-slug-generator')
// const mongooseDelete = require('mongoose-delete');

// const Cource = new Schema({
//     name: {type: String, required: true},
//     description: {type: String},
//     image: {type: String},
//     videoid: {type: String, required: true},
//     // createdAt: {type: Date, default: Date.now},
//     // updatedAt: {type: Date, default: Date.now}
//     slug: { type: String, slug: 'name', unique: true }
//   },{
//     timestamps : true
//   });
//   mongoose.plugin(slug)
//   Cource.plugin(mongooseDelete,{ deletedAt : true, overrideMethods: 'all', })

//   module.exports = mongoose.model('courses', Cource)