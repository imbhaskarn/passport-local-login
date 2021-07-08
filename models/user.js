const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let User = new Schema({
      name: {
        type: String,
        unique: true,
        required: true
      },
      email: {
        type: String,
        unique: true,
        required: true
      },
      password: {
        type: String,
        unique: true,
        required: true,
      },
      date: { type: String, default: Date.now().toString() }
      })
module.exports = mongoose.model('User', User)