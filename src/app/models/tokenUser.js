const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  token: { type: String, required: true },
  expireAt: { type: Date, default: Date.now, index: { expires: 60 } }
});

module.exports = mongoose.model('tokenUser', tokenSchema)