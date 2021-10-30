const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const slug = require('mongoose-slug-generator');
const messages = require('./messages');
const accountSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, default: ""},
    displayName: {type: String, required: true},
    email: {type: String, default:""},
    numberPhone: {type: String, default:""},
    avatar: {type: String, default:"https://res.cloudinary.com/dq7zeyepu/image/upload/v1633701290/avatar/images_qnphd9.png"},
    googleId: {type: String, default:""},
    facebookId: {type: String, default:""},
    isVerified: {
        type: Boolean,
        default: false,
    },
    // truong ref cua 2 model phai giong nhau thi moi populate duoc
    // neu thay _id cua arrayIdChat1v1 thanh idMess thi se khong populate duoc
    arrayIdChat1v1: [{_id:{type:ObjectId, ref:messages}, idFriend: {type:ObjectId, ref:'account'},/*displayNameFriend: String, avatarFriend: String*/}],
    //arrPop:{type:ObjectId, ref:'account'},
    arrayIdChatGroup: [{_id:{type:ObjectId, ref:messages}}],
    friends: [{type:ObjectId, ref:'account'}/*{ _id:false,idFriend:{type: ObjectId}, displayNameFriend: String, avatarFriend: String}*/],
    requestFriends: [{type:ObjectId, ref:'account'}/*{ _id:false, idRequestFriend:{type: ObjectId}, displayNameRequestFriend: String, avatarRequestFriend: String}*/],
    waitAcceptFriends: [{type:ObjectId, ref:'account'}/*{ _id:false, idWaitAcceptFriend:{type: ObjectId}, displayNameWaitAcceptFriend: String, avatarWaitAcceptFriend: String}*/],
}, {
    collection: 'account',
    timestamps: true,
});
mongoose.plugin(slug);
module.exports =  mongoose.model('account',accountSchema);