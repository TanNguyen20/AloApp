const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Account = require('../models/account');
const slug = require('mongoose-slug-generator');

const messagesSchema = new Schema({
    arrayContent1v1:[{_id:false, from: String, to: String, content: String, typeMess: String}],
    arrayContentGroup:[{_id:false,from: String, to: String, content: String, typeMess: String}],
    // user1:{type:ObjectId, ref:Account},
    // user2:{type:ObjectId, ref:Account},
}, {
    // strictPopulate:false,
    collection: 'messages',
    timestamps: true,
});
mongoose.plugin(slug);

module.exports =  mongoose.model('messages',messagesSchema);