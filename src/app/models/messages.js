const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Account = require('../models/account');
const slug = require('mongoose-slug-generator');

const messagesSchema = new Schema({
    arrayContent1v1:[{_id:false, from: String, to: String, content: String, typeMess: String}],
    arrayContentGroup:[{_id:false,from: String, to: String, content: String, typeMess: String}],
    friendInGroup: [{_id: {type:ObjectId, ref:'account'}, statusDelete:{type:Boolean, default:false}}],
    groupName: {type: String, required: true},
    avatarGroup:{type: String, default: 'https://res.cloudinary.com/dq7zeyepu/image/upload/v1635935296/avatar/owg5qlrubhdfufvwocrw.jpg'}
    // user1:{type:ObjectId, ref:Account},
    // user2:{type:ObjectId, ref:Account},
}, {
    // strictPopulate:false,
    collection: 'messages',
    timestamps: true,
});
mongoose.plugin(slug);

module.exports =  mongoose.model('messages',messagesSchema);