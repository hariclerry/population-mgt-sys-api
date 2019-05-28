const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create schema
const userSchema = Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean,
  created: { 
    type: Date,
    default: Date.now
}
});

module.exports = mongoose.model('User', userSchema)
