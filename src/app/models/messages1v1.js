const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const slug = require('mongoose-slug-generator');

const messages1v1Schema = new Schema({
    arrayContent:[{from: String, to: String, content: String, typeMess: String}],
    user1:{type:ObjectId, ref:Account},
    user2:{type:ObjectId, ref:Account},
}, {
    collection: 'messages1v1',
    timestamps: true,
});
mongoose.plugin(slug);

module.exports =  mongoose.model('messages1v1',messages1v1Schema);