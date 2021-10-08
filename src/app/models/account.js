const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const slug = require('mongoose-slug-generator');

const accountSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
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

}, {
    collection: 'account',
    timestamps: true,
});
mongoose.plugin(slug);

module.exports =  mongoose.model('account',accountSchema);